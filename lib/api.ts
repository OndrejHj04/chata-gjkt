"use server";

import { getServerSession } from "next-auth";
import { query } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { transporter } from "./email";
import dayjs from "dayjs";
import { sign } from "jsonwebtoken";
import { roomsEnum } from "@/app/constants/rooms";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const getImages = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: images } = await supabase.storage.from("images").list();
  const imageUrls = images?.map((item) => {
    const { publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(item.name).data;
    return {
      id: item.created_at,
      name: item.name,
      created_at: item.created_at,
      publicUrl,
    };
  });

  return imageUrls;
};

export const uploadProfilePicture = async (image: any, userId: number) => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const userImagePath = `user_${userId}/picture`;

    await supabase.storage.from("profile-pictures").remove([userImagePath]);

    await supabase.storage
      .from("profile-pictures")
      .upload(userImagePath, image, {
        cacheControl: "0",
      });

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(userImagePath);

    query({
      query: `
    UPDATE users 
    SET image = ?
    WHERE id = ?`,
      values: [publicUrl, userId],
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

export const uploadImage = async (fileData) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileData.name, fileData, {
      cacheControl: "3600",
      upsert: false,
    });

  // create empty folder
  //     .upload(`/xxxx/file/path`, new Blob([''], { type: 'text/plain' }), {
  //   cacheControl: "3600",
  //   upsert: false,
  // });
};

export const getUserList = async ({
  page,
  search,
  role,
  organization,
  verified,
  sort,
  dir,
}: {
  page: any;
  search: any;
  role: any;
  organization: any;
  verified: any;
  sort: any;
  dir: any;
}) => {
  const allowedSort = [
    "u.name",
    "u.email",
    "u.role",
    "u.organization",
    "u.verified",
  ];
  const { user } = (await getServerSession(authOptions)) as any;

  const [users, count] = (await Promise.all([
    query({
      query: `
SELECT 
    u.id, 
    CONCAT(u.first_name, ' ', u.last_name) AS name, 
    u.email, 
    u.verified, 
    r.name AS role_name, 
    r.id as role_id,
    u.image, 
    o.name AS organization_name,
    CASE WHEN ${user.role.id} IN (1, 2) OR u.id = ${
        user.id
      } THEN TRUE ELSE FALSE END AS detail,
    CASE WHEN u_child.id IS NULL THEN NULL
    ELSE GROUP_CONCAT(JSON_OBJECT('id', u_child.id, 'name', CONCAT(u_child.first_name, ' ', u_child.last_name), 'role', child_r.name, 'organization', child_o.name, 'role_id', child_r.id, 'detail', CASE WHEN ${
      user.role.id
    } IN (1, 2) OR u.id = ${
        user.id
      } THEN TRUE ELSE FALSE END) separator '|||') END as children
FROM users u
INNER JOIN roles r ON r.id = u.role
LEFT JOIN organization o ON o.id = u.organization
LEFT JOIN users u_child ON u.email = u_child.email AND u_child.children = 1
LEFT JOIN roles child_r ON child_r.id = u_child.role
LEFT JOIN organization child_o ON child_o.id = u_child.organization
WHERE u.children = 0
${
  search.length
    ? `AND CONCAT(u.first_name, ' ', u.last_name) LIKE "%${search}%"`
    : ""
}
${role > 0 ? `AND u.role = ${role}` : ""}
${organization > 0 ? `AND u.organization = ${organization}` : ""}
${verified > 0 ? `AND u.verified = ${verified === 2 ? 0 : verified}` : ""}

GROUP BY u.id
        ${
          dir !== "" && allowedSort.includes(sort)
            ? `ORDER BY ${sort} ${dir}`
            : ""
        }
LIMIT 10 OFFSET ?
        
      `,
      values: [page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(*) as count FROM users u
      INNER JOIN roles r ON r.id = u.role
      LEFT JOIN organization o ON o.id = u.organization
      WHERE u.children = 0
      ${
        search.length
          ? `AND CONCAT(u.first_name, ' ', u.last_name) LIKE "%${search}%"`
          : ""
      }
      ${role > 0 ? `AND u.role = ${role}` : ""}
      ${organization > 0 ? `AND u.organization = ${organization}` : ""}
      ${verified > 0 ? `AND u.verified = ${verified === 2 ? 0 : verified}` : ""}
      `,
      values: [],
    }),
  ])) as any;

  const data = users.map((user: any) => ({
    ...user,
    children: user.children
      ? user.children.split("|||").map((item: any) => JSON.parse(item))
      : [],
  }));

  return { data: data, count: count[0].count };
};

export const getReservationList = async ({
  page,
  status,
  search,
  registration,
  sort,
  dir,
}: {
  page: any;
  status: any;
  search: any;
  registration: any;
  sort: any;
  dir: any;
}) => {
  const allowedSort = [
    "r.name",
    "r.creation_date",
    "r.from_date",
    "r.to_date",
    "users_count",
  ];
  const { user } = (await getServerSession(authOptions)) as any;

  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `  
        SELECT r.id, r.name, r.from_date, r.to_date, r.creation_date, CONCAT(u.first_name, ' ', u.last_name) as leader_name, u.image as leader_image, u.id as leader_id,
                s.icon as status_icon, s.color as status_color, s.display_name as status_name, s.id as status_id, r.reject_reason, r.success_link,
               (SELECT COUNT(*) FROM users_reservations ur WHERE ur.reservationId = r.id AND ur.verified = 1) AS users_count,
               (SELECT SUM(ro.people) 
                FROM reservations_rooms rr 
                LEFT JOIN rooms ro ON ro.id = rr.roomId 
                WHERE rr.reservationId = r.id) AS beds_count,
                (SELECT EXISTS (SELECT rf.user_id FROM reservations_forms rf WHERE rf.reservation_id = r.id)) as active_registration,
                CASE WHEN ${user.role.id} IN (1, 2) OR r.leader = ${user.id}
                OR EXISTS (SELECT 1 FROM users_reservations ur WHERE ur.reservationId = r.id AND ur.userId = ${
                  user.id
                })
                THEN TRUE ELSE FALSE END AS detail
        FROM reservations r
        LEFT JOIN users u ON u.id = r.leader
        LEFT JOIN reservations_forms rf ON rf.reservation_id = r.id
        INNER JOIN status s ON s.id = r.status
        WHERE r.status <> 1
              ${status > 0 ? `AND r.status = ${status}` : ""}
              ${search.length ? `AND r.name LIKE "%${search}%"` : ""}
              ${
                registration > 0
                  ? `AND ${
                      registration === 2 ? "NOT" : ""
                    } EXISTS (SELECT 1 FROM reservations_forms rf WHERE rf.reservation_id = r.id)`
                  : ""
              }
        GROUP BY r.id
        ${
          dir !== "" && allowedSort.includes(sort)
            ? `ORDER BY ${sort} ${dir}`
            : "ORDER BY r.creation_date desc"
        }
        LIMIT 10 OFFSET ?
      `,
      values: [page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(r.id) as count FROM reservations r
      WHERE r.status <> 1
      ${status > 0 ? `AND r.status = ${status}` : ""}
      ${search.length ? `AND r.name LIKE "%${search}%"` : ""}
      `,
      values: [],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getReservationCalendarData = async ({
  rooms = [],
}: {
  rooms: any;
}) => {
  const [result] = (await Promise.all([
    query({
      query: `SELECT reservations.id, reservations.from_date, reservations.to_date, reservations.name, reservations.creation_date, reservations.purpouse,
        reservations.leader, reservations.status, JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name) as leader, 
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
        ) as rooms
          FROM reservations
        INNER JOIN status ON status.id = reservations.status
        LEFT JOIN users ON users.id = reservations.leader 
        LEFT JOIN reservations_rooms ON reservations_rooms.reservationId = reservations.id
        LEFT JOIN rooms ON reservations_rooms.roomId = rooms.id
        WHERE 1=1
        ${
          rooms.length
            ? `AND ${rooms
                .map((item: any, index: any) =>
                  index === rooms.length - 1
                    ? `rooms.id = ${item}`
                    : `rooms.id = ${item} OR`
                )
                .join(" ")}`
            : ""
        }
        GROUP BY reservations.id
        `,
    }),
  ])) as any;

  const data = result.map((item: any) => ({
    ...item,
    leader: JSON.parse(item.leader),
    status: JSON.parse(item.status),
    rooms: JSON.parse(`[${item.rooms}]`).filter(({ id }: { id: any }) => id),
  }));

  return { data };
};

export const sendEmail = async ({
  send,
  to,
  template,
  variables,
}: {
  send: any;
  to: any;
  template: any;
  variables: any;
}) => {
  const { allowEmails } = await getEmailSettings();

  if (!send || !allowEmails) {
    return {
      success: false,
      msg: "Email se neodeslal z důvodu rozhodnutí administrátora.",
    };
  }

  function MakeEmailText(text: any, variables: any) {
    variables.map((item: any) => {
      text = text.replace("${" + item.name + "}", item.value);
    });
    return text;
  }

  const mainEmailRequest = (await query({
    query: `SELECT main_application_email FROM settings`,
  })) as any;
  const mainEmail = mainEmailRequest[0].main_application_email;

  const mailContent = MakeEmailText(template.text, variables);
  const mail = await transporter.sendMail({
    from: mainEmail,
    to,
    subject: template.title,
    html: mailContent,
  });

  await query({
    query: `INSERT INTO emails (recipients, subject, content) VALUES (?,?,?)`,
    values: [mail.accepted.toString(), template.title, mailContent],
  });
  if (mail.accepted.length === to.length) {
    return { success: true };
  }
  return { success: false };
};

export const mailEventDetail = async ({ id }: { id: any }) => {
  const event = (await query({
    query: `
      SELECT events_children.id, primary_txt, secondary_txt, active, variables,
      JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text) as template 
      FROM events_children LEFT JOIN templates ON templates.id = events_children.template WHERE events_children.id = ?
  `,
    values: [id],
  })) as any;

  const data = {
    ...event[0],
    template: JSON.parse(event[0].template),
    variables: event[0].variables.split(","),
  };

  return { data };
};

export const userAddGroups = async ({
  user,
  group,
}: {
  user: any;
  group: any;
}) => {
  const request = (await query({
    query: `INSERT INTO users_groups (userId, groupId) VALUES (?,?)`,
    values: [user, group],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const userAddReservations = async ({
  user,
  reservation,
}: {
  user: any;
  reservation: any;
}) => {
  const [{ affectedRows }, { data }, userDetail, reservationDetail] =
    (await Promise.all([
      query({
        query: `INSERT INTO users_reservations (userId, reservationId) VALUES (?,?)`,
        values: [user, reservation],
      }),
      mailEventDetail({ id: 8 }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
      query({
        query: `SELECT r.name, r.from_date, r.to_date, CONCAT(u.first_name, ' ', u.last_name) as leader_name, u.email as leader_email FROM reservations r
        INNER JOIN users u ON u.id = r.leader WHERE r.id = ?`,
        values: [reservation],
      }),
    ])) as any;

  await sendEmail({
    send: data.active,
    to: userDetail[0].email,
    template: data.template,
    variables: [
      {
        name: "reservation_name",
        value: reservationDetail[0].name,
      },
      {
        name: "reservation_start",
        value: dayjs(reservationDetail[0].from_date).format("DD.MM.YYYY"),
      },
      {
        name: "reservation_end",
        value: dayjs(reservationDetail[0].to_date).format("DD.MM.YYYY"),
      },
      {
        name: "leader_name",
        value: reservationDetail[0].leader_name,
      },
      { name: "leader_email", value: reservationDetail[0].leader_email },
    ],
  });

  return { success: affectedRows === 1 };
};

export const getUserTheme = async () => {
  const user = (await getServerSession(authOptions)) as any;
  if (!user) return { theme: 1 };

  const [{ theme }] = (await query({
    query: `SELECT theme FROM users WHERE id = ?`,
    values: [user.user.id],
  })) as any;

  return { theme };
};

export const importNewUsers = async ({ users }: { users: any }) => {
  const template = (await mailEventDetail({ id: 1 })) as any;

  const emails = [] as any;
  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `INSERT INTO users (first_name, last_name, email, role, password, verified) VALUES ${users.map(
        (user: any) => {
          user.password = Math.random().toString(36).slice(-9);
          emails.push({ email: user.email, password: user.password });
          return `("${user.first_name}", "${user.last_name}", "${user.email}", "${user.role}", MD5("${user.password}"), 0)`;
        }
      )}`,
      values: [],
    }),
  ])) as any;

  emails.map(async (user: any) => {
    await sendEmail({
      send: template.data.active,
      to: user.email,
      template: template.data.template,
      variables: [
        { name: "email", value: user.email },
        { name: "password", value: user.password },
      ],
    });
  });

  return { success: affectedRows === users.length, count: affectedRows };
};

export const userGoogleLogin = async ({ account }: { account: any }) => {
  const [data] = (await Promise.all([
    query({
      query: `SELECT users.id, users.first_name, users.last_name, users.email, users.image, users.theme, users.verified, JSON_OBJECT('id', roles.id, 'name', roles.name) as role, users.adress FROM users INNER JOIN roles ON roles.id = users.role WHERE email = ? AND role <> 4`,
      values: [account.email],
    }),
    query({
      query: `UPDATE users SET image = ? WHERE email = ? AND role <> 4`,
      values: [account.picture, account.email],
    }),
  ])) as any;

  if (!data.length) {
    return { user: null };
  }

  return {
    user: {
      ...data[0],
      role: JSON.parse(data[0].role),
      image: account.picture,
    },
  };
};

export const userLogin = async ({
  email,
  password,
}: {
  email: any;
  password: any;
}) => {
  const data = (await query({
    query: `SELECT users.id, users.image, users.first_name, users.last_name, users.email, users.image, users.theme, users.verified, JSON_OBJECT('id', roles.id, 'name', roles.name) as role, users.adress FROM users INNER JOIN roles ON roles.id = users.role WHERE email = ? AND password = MD5(?) AND role <> 4`,
    values: [email, password],
  })) as any;

  if (!data.length) {
    return { user: null };
  }

  return { user: { ...data[0], role: JSON.parse(data[0].role) } };
};

export const createUserAccount = async ({
  first_name,
  last_name,
  email,
  role,
}: {
  first_name: any;
  last_name: any;
  email: any;
  role: any;
}) => {
  const password = Math.random().toString(36).slice(-9) as any;

  const check = (await query({
    query: `SELECT u.id FROM users u WHERE u.email = ?`,
    values: [email],
  })) as any;

  if (check.length) {
    return { success: false, msg: "Uživatel s tímto emailem už existuje" };
  }

  const [{ affectedRows }, { data }] = (await Promise.all([
    query({
      query: `INSERT INTO users (first_name, last_name, email, role, password, verified) VALUES(?,?,?,?, MD5(?), 0)`,
      values: [first_name, last_name, email, role, password],
    }),
    mailEventDetail({ id: 1 }),
  ])) as any;

  await sendEmail({
    send: data.active,
    to: email,
    template: data.template,
    variables: [
      { name: "email", value: email },
      { name: "password", value: password },
    ],
  });

  return { success: affectedRows === 1 };
};

export const validateImport = async ({ data }: { data: any }) => {
  const validData = data.filter((item: any) =>
    item.every((row: any) => row.length)
  );

  const value = (await query({
    query: `SELECT email FROM users WHERE email IN(${validData
      .map((item: any) => `"${item[2]}"`)
      .join(",")})`,
  })) as any;

  const set = new Set();

  value.map((item: any) => {
    set.add(item.email);
  });

  return {
    data: validData.map((valid: any) => [...valid, !set.has(valid[2])]),
  };
};

export const getRolesList = async () => {
  const data = await query({
    query: `SELECT * FROM roles `,
    values: [],
  });

  return { data };
};

export const resetUserPassword = async ({
  password,
  id,
}: {
  password: any;
  id: any;
}) => {
  const { affectedRows } = (await query({
    query: `UPDATE users SET password = MD5(?) WHERE id = ? `,
    values: [password, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const sendResetPasswordEmail = async ({ email }: { email: any }) => {
  const users = (await query({
    query: `SELECT  id, email FROM users WHERE email = ? `,
    values: [email],
  })) as any;

  if (users.length) {
    const tkn = sign(
      {
        exp: dayjs().add(1, "day").unix() * 1000,
        id: users[0].id,
      },
      "Kraljeliman"
    );

    const template = await mailEventDetail({ id: 4 });

    const { success, msg } = await sendEmail({
      send: template.data.active,
      to: [email],
      template: template.data.template,
      variables: [
        {
          name: "link",
          value: `${process.env.NEXT_PUBLIC_API_URL}/password-reset?userId=${users[0].id}&token=${tkn}`,
        },
      ],
    });

    return { success: success, msg };
  }
  return { success: false };
};

export const setBlockedDates = async ({
  from_date,
  to_date,
}: {
  from_date: any;
  to_date: any;
}) => {
  const { user } = (await getServerSession(authOptions)) as any;

  const blocation = (await query({
    query: `INSERT INTO reservations (from_date, to_date, name, status, leader, purpouse, instructions) VALUES(?, ?, "Blokace", 5, ?, "blokace", "")`,
    values: [from_date, to_date, user.id],
  })) as any;
  const [{ affectedRows: affectedRows }, _] = (await Promise.all([
    query({
      query: `UPDATE reservations SET status = 4 WHERE((from_date BETWEEN ? AND ?) OR(to_date BETWEEN ? AND ?)) AND status <>5 AND status <> 1`,
      values: [from_date, to_date, from_date, to_date],
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
      values: [
        roomsEnum.list.map((room: any) => [blocation.insertId, room.id]),
      ],
    }),
  ])) as any;

  return {
    success: affectedRows === 1,
    from_date,
    to_date,
  };
};

export const reservationUpdateStatus = async ({
  id,
  newStatus,
  rejectReason = null,
  successLink = null,
}: {
  id: any;
  newStatus: any;
  rejectReason?: any;
  successLink?: any;
}) => {
  const req = (await query({
    query: `UPDATE reservations SET status = ?, reject_reason = null, success_link = null, payment_symbol = null WHERE reservations.id = ?`,
    values: [newStatus, id],
  })) as any;

  const { format } = (await query({
    query: `SELECT payment_symbol_format as format FROM settings`,
    values: [newStatus, id],
  })) as any;

  const payment_symbol = await generatePaymenetSymbol(id);

  if (newStatus === 3) {
    successLink &&
      successLink.length &&
      (await query({
        query: `UPDATE reservations SET success_link = ? WHERE reservations.id = ?`,
        values: [successLink, id],
      }));

    (await query({
      query: `
      UPDATE reservations
      SET payment_symbol = ?
      WHERE reservations.id = ?;        
      `,
      values: [payment_symbol, id],
    })) as any;

    approveReservationSendMail({ reservationId: id });
  }

  if (newStatus === 4) {
    rejectReason &&
      rejectReason.length &&
      (await query({
        query: `UPDATE reservations SET reject_reason = ? WHERE reservations.id = ?`,
        values: [rejectReason, id],
      }));
    rejectReservationSendMail({ reservationId: id });
  }

  return { success: req.affectedRows === 1 };
};

export const createNewGroup = async ({
  name,
  description,
  owner,
}: {
  name: any;
  description: any;
  owner: any;
}) => {
  const { insertId, affectedRows } = (await query({
    query: `INSERT INTO groups (name, description, owner) VALUES (?,?,?)`,
    values: [name, description, owner],
  })) as any;

  await query({
    query: `INSERT INTO users_groups (userId, groupId) VALUES ("${owner}", "${insertId}")`,
  });

  return { success: affectedRows === 1, id: insertId };
};

export const getGroupList = async ({
  page,
  search,
  limit = false,
  rpp = 10,
}: {
  page?: any;
  search?: any;
  limit?: any;
  rpp?: any;
}) => {
  const {
    user: { role, id },
  } = (await getServerSession(authOptions)) as any;
  const isLimited = role.id > 2;

  const [groups, reservations, users, count] = (await Promise.all([
    query({
      query: `
        SELECT groups.id, groups.name, description, 
        JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) AS owner, 
        GROUP_CONCAT(DISTINCT reservationId) AS reservations, GROUP_CONCAT(DISTINCT userId) AS users 
        FROM groups 
        LEFT JOIN users ON users.id = owner 
        LEFT JOIN users_groups ON users_groups.groupId = groups.id 
        LEFT JOIN reservations_groups ON reservations_groups.groupId = groups.id 
        LEFT JOIN reservations ON reservations.id = reservations_groups.groupId
        WHERE 1=1
        ${search ? `AND groups.name LIKE "%${search}%"` : ""}
        ${limit && isLimited ? `AND groups.owner = ${id}` : ""}
        GROUP BY 
            groups.id
        ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}
      `,
      values: [],
    }),
    query({
      query: `SELECT id, from_date, to_date, name FROM reservations`,
      values: [],
    }),
    query({
      query: `SELECT first_name, last_name, email, id FROM users`,
      values: [],
    }),
    query({
      query: `
        SELECT COUNT(*) as total FROM groups
        WHERE 1=1
        ${search ? `AND groups.name LIKE "%${search}%"` : ""}
        ${limit && isLimited ? `AND groups.owner = ${id}` : ""}
      `,
      values: [],
    }),
  ])) as any;

  const data = groups.map((group: any) => {
    return {
      ...group,
      owner: JSON.parse(group.owner),
      reservations: group.reservations
        ? group.reservations
            .split(",")
            .map((res: any) =>
              reservations.find((r: any) => r.id === Number(res))
            )
        : [],
      users: group.users ? group.users.split(",").map(Number) : [],
    };
  });

  return { data, count: count[0].total };
};

export const mailingTemplateEdit = async ({
  name,
  text,
  title,
  id,
}: {
  name: any;
  text: any;
  title: any;
  id: any;
}) => {
  const { affectedRows } = (await query({
    query: `
    UPDATE templates SET name = ?, title = ?, text = ? WHERE id = ?
  `,
    values: [name, title, text, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const malingTemplatesList = async () => {
  const dataRequest = (await query({
    query: `SELECT t.id, t.name, t.title, t.text FROM templates t`,
    values: [],
  })) as any;

  return dataRequest;
};

export const malingTemplateDetail = async ({ id }: { id: any }) => {
  const templates = (await query({
    query: `
        SELECT templates.id, templates.name, templates.title, templates.text, events_children.variables 
        FROM templates
        INNER JOIN events_children ON events_children.template = templates.id
        WHERE templates.id = ?
  `,
    values: [id],
  })) as any;

  const data = {
    ...templates[0],
    variables: templates[0].variables.split(","),
  };

  return data;
};

export const mailingEventsEdit = async ({ data }: { data: any }) => {
  const array = Object.entries(data);
  const { affectedRows } = (await query({
    query: `
            INSERT INTO events_children (id, active)
            VALUES ${array.map(
              (item) => `(${item[0].split(" ")[1]}, ${item[1]})`
            )}
            ON DUPLICATE KEY UPDATE id=VALUES(id),
            active=VALUES(active), primary_txt = primary_txt, secondary_txt = secondary_txt, template = template, event = event, variables = variables`,
    values: [],
  })) as any;

  return { success: affectedRows === array.length };
};

export const getMailingEventsList = async () => {
  const dataRequest = (await query({
    query: `SELECT * FROM events_children`,
    values: [],
  })) as any;

  return { data: dataRequest };
};

export const verifyUser = async ({
  ID_code,
  birth_date,
  newPassword,
  password,
  adress,
  id,
}: {
  ID_code: any;
  birth_date: any;
  newPassword: any;
  password: any;
  adress: any;
  id: any;
}) => {
  const [{ affectedRows }, user] = (await Promise.all([
    await query({
      query: `UPDATE users SET password = MD5(?), ID_code = ?, verified = 1, birth_date = ?, adress = ? WHERE id = ? AND password = MD5(?)`,
      values: [
        newPassword,
        ID_code,
        dayjs(birth_date).format("YYYY-MM-DD"),
        adress,
        id,
        password,
      ],
    }),
    await query({
      query: `SELECT email FROM users WHERE users.id = ?`,
      values: [id],
    }),
  ])) as any;

  if (affectedRows === 0) {
    return { success: false };
  }

  return { success: affectedRows === 1, email: user[0].email };
};

export const setTheme = async (theme: any, id: any) => {
  const req = (await query({
    query: `UPDATE users SET theme = ? WHERE id = ?`,
    values: [!theme, id],
  })) as any;
};

export const getSendMails = async ({ page = 1, rpp = 10 }: any) => {
  const [data, count] = (await Promise.all([
    query({
      query: `SELECT emails.id, emails.recipients, emails.subject, emails.content, emails.date FROM emails ORDER BY emails.date DESC
    ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}`,
      values: [],
    }),
    query({
      query: `SELECT COUNT(*) as count FROM emails`,
      values: [],
    }),
  ])) as any;

  return { data, count: count[0].count };
};

export const getSendMailDetail = async (id: any) => {
  const data = (await query({
    query: `SELECT emails.id, emails.recipients, emails.subject, emails.content, emails.date FROM emails WHERE emails.id = ?`,
    values: [id],
  })) as any;
  return { data: data[0] };
};

export const reservationSaveRooms = async ({
  reservation,
  rooms,
}: {
  reservation: any;
  rooms: any;
}) => {
  const [_, { affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM reservations_rooms WHERE reservationId = ?`,
      values: [reservation],
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
      values: [rooms.map((room: any) => [reservation, room])],
    }),
    query({
      query: `INSERT INTO reservations_rooms_change (reservation_id, rooms) VALUES (?,?)`,
      values: [reservation, rooms.toString()],
    }),
  ])) as any;

  return { success: affectedRows === rooms.length };
};

export const toggleEmailSettings = async (switchValue: boolean) => {
  const { affectedRows } = (await query({
    query: `UPDATE settings SET allow_mail_sending = ?`,
    values: [switchValue],
  })) as any;

  return { success: affectedRows === 1 };
};

export const getEmailSettings = async () => {
  const req = (await query({
    query: `SELECT allow_mail_sending FROM settings`,
  })) as any;

  return { allowEmails: req[0].allow_mail_sending };
};

export const allowReservationSignIn = async ({
  reservation,
}: {
  reservation: any;
}) => {
  const { user } = (await getServerSession(authOptions)) as any;
  const documentRequest = (await query({
    query: `SELECT registration_document_spreadsheet FROM settings`,
  })) as any;
  const document = documentRequest[0].registration_document_spreadsheet;

  const reqBody = {
    name: reservation.name,
    from_date: dayjs(reservation.from_date).format("DD. MM. YYYY"),
    to_date: dayjs(reservation.to_date).format("DD. MM. YYYY"),
    instructions: reservation.instructions,
    leader: {
      first_name: reservation.first_name,
      last_name: reservation.last_name,
    },
  };

  const req = await fetch(process.env.GOOGLE_FORM_API as any, {
    method: "POST",
    body: JSON.stringify({ data: reqBody, action: "create", document }),
  });

  const { formId, formPublicUrl } = await req.json();

  await Promise.all([
    query({
      query: `INSERT INTO reservations_forms (form_id, form_public_url, reservation_id, user_id) VALUES (?,?,?,?)`,
      values: [formId, formPublicUrl, reservation.id, user.id],
    }),
    query({
      query: `INSERT INTO reservations_forms_changes (reservation_id, form_id, form_public_url, direction) VALUES (?,?,?,1)`,
      values: [reservation.id, formId, formPublicUrl],
    }),
  ]);

  return { success: true };
};

export const cancelRegistration = async ({ formId }: { formId: any }) => {
  await query({
    query: `INSERT INTO reservations_forms_changes (reservation_id, form_id, direction) SELECT rf.reservation_id, ?, 0 FROM reservations_forms rf WHERE rf.form_id = ?`,
    values: [formId, formId],
  });

  const [, { affectedRows }] = (await Promise.all([
    fetch(process.env.GOOGLE_FORM_API as any, {
      method: "POST",
      body: JSON.stringify({ data: { formId }, action: "clear" }),
    }),
    query({
      query: `DELETE FROM reservations_forms WHERE form_id = ?`,
      values: [formId],
    }),
  ])) as any;

  return { success: affectedRows === 1 };
};

export const getRegistrationList = async ({ page }: { page: any }) => {
  const [data, count] = (await Promise.all([
    query({
      query: `SELECT rf.timestamp, r.from_date, rf.form_public_url, rf.form_id, r.id as reservation_id, JSON_OBJECT('id', u.id, 'first_name', u.first_name, 'last_name', u.last_name, 'image', u.image, 'email',u.email) as author, COUNT(ur.userId) as outside_registration_count 
      FROM reservations_forms rf
      INNER JOIN users u ON u.id = rf.user_id
      INNER JOIN reservations r ON r.id = rf.reservation_id
      LEFT JOIN users_reservations ur ON ur.reservationId = r.id AND ur.verified = 0 AND ur.outside = 1
      GROUP BY rf.form_id
      ORDER BY r.from_date
      LIMIT 10 OFFSET ?
      `,
      values: [page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(*) as count FROM reservations_forms 
    `,
      values: [],
    }),
  ])) as any;

  return {
    data: data.map((item: any) => ({
      ...item,
      author: JSON.parse(item.author),
    })),
    count: count[0].count,
  };
};

export const getReservationLeader = async ({ id }: { id: any }) => {
  const data = await query({
    query: `SELECT leader FROM reservations WHERE id = ?`,
    values: [id],
  });

  return { data };
};

export const getUsersAvaliableGroups = async (id: any) => {
  const data = (await query({
    query: `SELECT groups.id, groups.name, CONCAT('[', COALESCE(GROUP_CONCAT(users.id), ''), ']') AS users FROM groups LEFT JOIN users_groups ON users_groups.groupId = groups.id LEFT JOIN users ON users.id = users_groups.userId WHERE owner = ? GROUP BY groups.id`,
    values: [id],
  })) as any;

  const groups = data.map((item: any) => ({
    ...item,
    users: JSON.parse(item.users),
  }));

  return { groups };
};

export const getUsersAvaliableReservations = async (id: any) => {
  const data = (await query({
    query: `SELECT reservations.id, reservations.name, CONCAT('[', COALESCE(GROUP_CONCAT(users.id), ''), ']') AS users FROM reservations
    LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id
    LEFT JOIN users ON users.id = users_reservations.userId
    WHERE leader = ? AND status <> 1 AND status <> 5
    GROUP BY reservations.id`,
    values: [id],
  })) as any;

  const reservations = data.map((item: any) => ({
    ...item,
    users: JSON.parse(item.users),
  }));

  return { reservations };
};

export const getGroupReservations = async ({
  groupId,
  page,
}: {
  groupId: any;
  page: any;
}) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT r.id, r.name, r.from_date, r.to_date, COUNT(ur.userId) as users_count, CONCAT(u.first_name, ' ', u.last_name) as leader_name,
      u.image as leader_image, s.icon as status_icon, s.display_name as status_name, s.color as status_color 
      FROM groups g 
      INNER JOIN reservations_groups rg ON rg.groupId = g.id
      INNER JOIN reservations r ON r.id = rg.reservationId
      LEFT JOIN users_reservations ur ON ur.reservationId = r.id
      INNER JOIN users u ON u.id = r.leader
      INNER JOIN status s ON s.id = r.status
      WHERE g.id = ?
      GROUP BY r.id
      LIMIT 10 OFFSET ?`,
      values: [groupId, page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(rg.reservationId) as count FROM groups g 
      INNER JOIN reservations_groups as rg ON rg.groupId = g.id
      WHERE g.id = ?`,
      values: [groupId],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getGroupUsers = async ({
  groupId,
  page,
}: {
  groupId: any;
  page: any;
}) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, u.email, u.image, r.name role, o.name as organization, u.verified
    FROM groups g
    INNER JOIN users_groups ug ON ug.groupId = g.id
    INNER JOIN users u ON ug.userId = u.id
    INNER JOIN roles r ON r.id = u.role
    LEFT JOIN organization o ON o.id = u.organization
    WHERE g.id = ?
    LIMIT 10 OFFSET ?
    `,
      values: [groupId, page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(g.id) as count FROM groups g 
      INNER JOIN users_groups ug ON ug.groupId = g.id
      WHERE g.id = ?`,
      values: [groupId],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getGroupDetail = async ({ groupId }: { groupId: any }) => {
  const req = (await query({
    query: `SELECT g.id, g.name, g.description, u.image as owner_image, CONCAT(u.first_name, ' ', u.last_name) as owner_name, u.email as owner_email FROM groups g INNER JOIN users u ON u.id = g.owner WHERE g.id = ?`,
    values: [groupId],
  })) as any;

  const data = req[0];

  return { data };
};

export const editGroupDetail = async ({
  groupId,
  name,
  description,
}: {
  groupId: any;
  name: any;
  description: any;
}) => {
  const req = (await query({
    query: `UPDATE groups set name = ?, description = ? WHERE groups.id = ?`,
    values: [name, description, groupId],
  })) as any;

  return { success: req.affectedRows === 1 };
};

export const getUserDetail = async ({ userId }: { userId: any }) => {
  const req = (await query({
    query: `SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, u.image, u.email, r.name as role, u.verified, u.adress, u.birth_date, u.ID_code, o.id as organization_id, o.name as organization_name, parent.id as parent_id, CONCAT(parent.first_name, ' ', parent.last_name) as parent_name, COUNT(ch.id) as children
    FROM users u 
    INNER JOIN roles r ON r.id = u.role
    LEFT JOIN users parent ON parent.email = u.email AND parent.id <> u.id AND parent.children = 0
    LEFT JOIN users ch ON ch.email = u.email AND ch.id <> u.id AND ch.children = 1 AND u.children <> 1
    LEFT JOIN organization o ON o.id = u.organization
    WHERE u.id = ?
    GROUP BY u.id
    `,
    values: [userId],
  })) as any;

  const data = req[0];
  return { data: data };
};

export const editUserDetail = async ({
  userId,
  ID_code,
  adress,
  organization,
}: {
  userId: any;
  ID_code: any;
  adress: any;
  organization: any;
}) => {
  const req = (await query({
    query: `UPDATE users set ID_code = ?, adress = ?, organization = ? WHERE users.id = ?`,
    values: [ID_code, adress, organization, userId],
  })) as any;

  return { success: req.affectedRows === 1 };
};

export const getUserGroups = async ({
  userId,
  page,
}: {
  userId: any;
  page: any;
}) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT g.id, g.name, g.description, CONCAT(o.first_name, ' ', o.last_name) as owner_name,o.image as owner_image
    FROM users u
    INNER JOIN users_groups ug ON ug.userId = u.id
    INNER JOIN groups g ON ug.groupId = g.id
    INNER JOIN users o ON o.id = g.owner
    WHERE u.id = ?
    LIMIT 10 OFFSET ?      
    `,
      values: [userId, page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(ug.groupId) as count FROM users u 
    INNER JOIN users_groups ug ON ug.userId = u.id
    WHERE u.id = ?`,
      values: [userId],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getUserReservations = async ({
  userId,
  page,
}: {
  userId: any;
  page: any;
}) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT r.id, r.name, r.from_date, r.to_date, CONCAT(l.first_name, ' ', l.last_name) as leader_name, l.image as leader_image, COUNT(ur2.userId) as users_count, s.color as status_color, s.icon as status_icon, s.display_name as status_name
        FROM users u
        INNER JOIN users_reservations ur ON ur.userId = u.id 
        INNER JOIN reservations r ON r.id = ur.reservationId
        INNER JOIN users l ON l.id = r.leader
        INNER JOIN users_reservations ur2 ON ur2.reservationId = r.id  AND ur2.verified = 1
        INNER JOIN status s ON s.id = r.status
        WHERE u.id = ?
        GROUP BY r.id
        LIMIT 10 OFFSET ?
      `,
      values: [userId, page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(ur.userId) as count FROM users u
      INNER JOIN users_reservations ur ON ur.userId = u.id
      WHERE u.id = ?`,
      values: [userId],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getReservationDetail = async ({
  reservationId,
}: {
  reservationId: any;
}) => {
  const dataRequest = (await query({
    query: `SELECT r.id, r.name, r.from_date, r.to_date, r.purpouse, u.image as leader_image, CONCAT(u.first_name, ' ', u.last_name) as leader_name,
    u.email as leader_email, s.display_name as status_name, s.icon as status_icon, s.color as status_color, r.success_link, r.payment_symbol, r.reject_reason, s.id as status_id, r.instructions, u.id as leader_id
    FROM reservations r
    LEFT JOIN users u ON u.id = r.leader
    LEFT JOIN status s ON s.id = r.status
    WHERE r.id = ?`,
    values: [reservationId],
  })) as any;

  const roomsRequest = await query({
    query: `
      SELECT ro.id, ro.people
      FROM reservations r
      LEFT JOIN reservations_rooms rr ON rr.reservationId = r.id
      INNER JOIN rooms ro ON ro.id = rr.roomId
      WHERE r.id = ?
    `,
    values: [reservationId],
  });

  const data = { ...dataRequest[0], rooms: roomsRequest };

  return { data };
};

export const editReservationDate = async ({
  reservationId,
  from_date,
  to_date,
}: {
  reservationId: any;
  from_date: any;
  to_date: any;
}) => {
  const req = (await query({
    query: `UPDATE reservations SET from_date = ?, to_date = ?, status = CASE WHEN status = 4 OR status = 3 THEN 2 ELSE status END WHERE reservations.id = ?`,
    values: [
      dayjs(from_date).format("YYYY-MM-DD"),
      dayjs(to_date).format("YYYY-MM-DD"),
      reservationId,
    ],
  })) as any;

  return { success: req.affectedRows === 1 };
};

export const editReservationStatus = async ({
  reservationId,
  newStatus,
}: {
  reservationId: any;
  newStatus: any;
}) => {
  const req = (await query({
    query: `UPDATE reservations SET status = ? WHERE reservations.id = ?`,
    values: [newStatus, reservationId],
  })) as any;

  const payment_symbol = await generatePaymenetSymbol(reservationId);

  if (newStatus === 3) {
    const [req] = (await Promise.all([
      query({
        query: `
UPDATE reservations
SET 
    payment_symbol = ?,
    reject_reason = null
WHERE reservations.id = ?;
          
        `,
        values: [payment_symbol, reservationId],
      }),
    ])) as any;

    approveReservationSendMail({ reservationId });
  }

  if (newStatus === 4) {
    query({
      query: `UPDATE reservations SET payment_symbol = null, success_link = null WHERE reservations.id = ?`,
      values: [reservationId],
    });
    rejectReservationSendMail({ reservationId });
  }

  const editedData = (await query({
    query: `SELECT payment_symbol, reject_reason, success_link FROM reservations WHERE reservations.id = ?`,
    values: [reservationId],
  })) as any;

  return {
    success: req.affectedRows === 1,
    symbol: editedData[0].payment_symbol,
    reject: editedData[0].reject_reason,
    link: editedData[0].success_link,
  };
};

export const editReservationDetail = async ({
  reservationId,
  name,
  instructions,
  purpouse,
  paymentSymbol,
  successLink,
  rejectReason,
}: {
  reservationId: any;
  name: any;
  instructions: any;
  purpouse: any;
  paymentSymbol: any;
  successLink: any;
  rejectReason: any;
}) => {
  const req = (await query({
    query: `UPDATE reservations SET name = ?, instructions = ?, purpouse = ?, payment_symbol = ?, success_link = ?, reject_reason = ? WHERE reservations.id = ?`,
    values: [
      name,
      instructions,
      purpouse,
      paymentSymbol,
      successLink,
      rejectReason,
      reservationId,
    ],
  })) as any;

  return { success: req.affectedRows === 1 };
};

export const getReservationUsers = async ({
  reservationId,
  page,
}: {
  reservationId: any;
  page: any;
}) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT CONCAT(u.first_name, ' ', u.last_name) as name, u.id, u.email, u.image, ro.name as role_name, o.name as organization_name, u.verified
      FROM reservations r 
      INNER JOIN users_reservations ur ON ur.reservationId = r.id AND ur.verified = 1
      INNER JOIN users u ON u.id = ur.userId
      INNER JOIN roles ro ON ro.id = u.role
      LEFT JOIN organization o ON o.id = u.organization
      WHERE r.id = ?
      LIMIT 10 OFFSET ?
      `,
      values: [reservationId, page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(ur.userId) as count FROM reservations r
      INNER JOIN users_reservations ur ON ur.reservationId = r.id AND ur.verified = 1
      WHERE r.id = ?`,
      values: [reservationId],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getReservationGroups = async ({
  reservationId,
  page,
}: {
  reservationId: any;
  page: any;
}) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT g.id, g.name, g.description, CONCAT(u.first_name, ' ', u.last_name) as owner_name, u.email as owner_email, u.image as owner_image FROM reservations r 
      INNER JOIN reservations_groups rg ON rg.reservationId = r.id
      INNER JOIN groups g ON g.id = rg.groupId
      INNER JOIN users u ON u.id = g.owner 
      WHERE r.id = ?
      LIMIT 10 OFFSET ?
      `,
      values: [reservationId, page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(rg.groupId) as count FROM reservations r
      INNER JOIN reservations_groups rg ON rg.reservationId = r.id
      WHERE r.id = ?`,
      values: [reservationId],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getUserGroupsWidgetData = async ({ userId }: { userId: any }) => {
  const dataRequest = (await query({
    query: `SELECT g.id, g.name, CONCAT(u.first_name, ' ', u.last_name) as leader_name FROM users_groups ug
    INNER JOIN groups g ON g.id = ug.groupId
    INNER JOIN users u ON u.id = g.owner
    WHERE ug.userId = ?`,
    values: [userId],
  })) as any;

  return { data: dataRequest };
};

export const getUserRegistrationWidgetData = async ({
  userId,
}: {
  userId: any;
}) => {
  const dataRequest = (await query({
    query: `
SELECT r.id, r.name, 
       COUNT(CASE WHEN ur.outside = 1 AND ur.verified = 0 THEN ur.userId END) AS user_count
FROM reservations_forms AS rf
INNER JOIN reservations r ON r.id = rf.reservation_id
LEFT JOIN users_reservations ur ON ur.reservationId = r.id
WHERE rf.user_id = ? OR r.leader = ?
GROUP BY r.id, r.name;
     `,
    values: [userId, userId],
  })) as any;

  return { data: dataRequest };
};

export const getUserReservationsWidgetData = async ({
  userId,
}: {
  userId: any;
}) => {
  const dataRequest = (await query({
    query: `SELECT r.id, r.name, r.from_date, r.to_date
    FROM users_reservations ur
    INNER JOIN reservations r ON r.id = ur.reservationId
    WHERE ur.userId = ?`,
    values: [userId],
  })) as any;

  return { data: dataRequest };
};

export const editReservationRooms = async ({
  reservationId,
  rooms,
}: {
  reservationId: any;
  rooms: any;
}) => {
  const [_, req] = (await Promise.all([
    query({
      query: `DELETE FROM reservations_rooms WHERE reservationId = ?`,
      values: [reservationId],
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
      values: [rooms.map((room: any) => [reservationId, room])],
    }),
  ])) as any;

  return { success: req.affectedRows === rooms.length };
};

export const getUserGroupsWhereOwner = async ({ userId }: { userId: any }) => {
  const dataRequest = await query({
    query: `SELECT g.id, g.name, COUNT(ug.userId) as users_count FROM groups g 
    INNER JOIN users_groups ug ON ug.groupId = g.id
    WHERE g.owner = ?
    GROUP BY g.id
    `,
    values: [userId],
  });

  return { data: dataRequest };
};

export const createNewReservation = async ({
  from_date,
  to_date,
  groups,
  rooms,
  leader,
  purpouse,
  instructions,
  name,
  family,
}: any) => {
  const { user } = (await getServerSession(authOptions)) as any;

  const request = (await query({
    query: `INSERT INTO reservations (from_date, to_date, name, purpouse, leader, instructions, status) VALUES (?,?,?,?,?,?,2)`,
    values: [from_date, to_date, name, purpouse, leader, instructions],
  })) as any;

  const queries = [];

  if (rooms.length) {
    queries.push(
      query({
        query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
        values: [rooms.map((room: any) => [request.insertId, room])],
      })
    );
  }

  queries.push(
    query({
      query: `INSERT INTO users_reservations (userId, reservationId) VALUES (?,?)`,
      values: [leader, request.insertId],
    })
  );

  if (groups.length) {
    queries.push(
      query({
        query: `INSERT INTO reservations_groups (reservationId, groupId) VALUES ?`,
        values: [groups.map((group: any) => [request.insertId, group])],
      })
    );

    queries.push(
      query({
        query: `
        INSERT IGNORE INTO users_reservations (reservationId, userId)
        SELECT ?, ug.userId 
        FROM users_groups ug 
        WHERE ug.groupId IN (?)`,
        values: [request.insertId, groups],
      })
    );
  }

  if (family) {
    queries.push(
      query({
        query: `INSERT INTO users_reservations (userId, reservationId) 
                SELECT u.id, ? FROM users u WHERE u.email = ? AND children = 1`,
        values: [request.insertId, user.email],
      })
    );
  }

  await Promise.all(queries);
  const [userEmails, template, leaderData] = (await Promise.all([
    query({
      query: `SELECT u.email FROM users_reservations ur INNER JOIN users u ON u.id = ur.userId WHERE u.role <> 4 AND ur.reservationId = ?`,
      values: [request.insertId],
    }),
    mailEventDetail({ id: 8 }),
    query({
      query: `SELECT CONCAT(u.first_name, ' ', u.last_name) as leader_name, u.email FROM users u WHERE u.id = ?`,
      values: [leader],
    }),
  ])) as any;

  await sendEmail({
    send: template.data.active,
    to: userEmails.map((item: any) => item.email),
    template: template.data.template,
    variables: [
      {
        name: "reservation_name",
        value: name,
      },
      {
        name: "reservation_start",
        value: dayjs(from_date).format("DD. MM. YYYY"),
      },
      {
        name: "reservation_end",
        value: dayjs(to_date).format("DD. MM. YYYY"),
      },
      {
        name: "leader_email",
        value: leaderData[0].email,
      },
      {
        name: "leader_name",
        value: leaderData[0].leader_name,
      },
    ],
  });

  return { success: request.affectedRows === 1 };
};

export const getUsersBySearch = async () => {
  const dataRequest = await query({
    query: `SELECT u.id, u.email, CONCAT(u.first_name, ' ', u.last_name) as name FROM users u WHERE u.role <> 4`,
    values: [],
  });

  return { data: dataRequest };
};

export const groupDelete = async ({ groupId }: { groupId: any }) => {
  const request = (await query({
    query: `DELETE FROM groups WHERE groups.id = ?`,
    values: [groupId],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const reservationDelete = async ({
  reservationId,
}: {
  reservationId: any;
}) => {
  const request = (await query({
    query: `DELETE FROM reservations WHERE reservations .id = ?`,
    values: [reservationId],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const reservationDeleteUser = async ({
  userId,
  reservationId,
}: {
  userId: any;
  reservationId: any;
}) => {
  const request = (await query({
    query: `DELETE FROM users_reservations WHERE userId = ? AND reservationId = ?`,
    values: [userId, reservationId],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const groupDeleteUser = async ({
  userId,
  groupId,
}: {
  userId: any;
  groupId: any;
}) => {
  const request = (await query({
    query: `DELETE FROM users_groups WHERE userId = ? AND groupId = ?`,
    values: [userId, groupId],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const setUserAsOutside = async ({ userId }: { userId: any }) => {
  const request = (await query({
    query: `UPDATE users SET role = 4 WHERE id = ?`,
    values: [userId],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const getReservationRegistration = async ({
  reservationId,
}: {
  reservationId: any;
}) => {
  const dataRequest = (await query({
    query: `SELECT r.id, r.name, r.leader, r.from_date, r.to_date, s.id as status_id, r.instructions, rf.form_id, rf.form_public_url, u.first_name, u.last_name, u.email FROM reservations r
    LEFT JOIN users u ON u.id = r.leader
    INNER JOIN status s ON s.id = r.status
    LEFT JOIN reservations_forms rf ON rf.reservation_id = r.id
    WHERE r.id = ?
    `,
    values: [reservationId],
  })) as any;

  return { data: dataRequest[0] };
};

export const getReservationRegisteredUsers = async ({
  reservationId,
  page,
}: {
  reservationId: any;
  page: any;
}) => {
  const dataRequest = (await query({
    query: `SELECT u.id, u.adress as user_adress, u.birth_date as user_birth_date, u.ID_code as user_ID_code, ur.timestamp, CONCAT(u.first_name, ' ', u.last_name) as name, u.email, r.id as role_id, r.name as role_name, ur.verified as verified_registration
    FROM users_reservations ur
    LEFT JOIN users u ON u.id = ur.userId
    INNER JOIN roles r ON r.id = u.role
    WHERE ur.reservationId = ? AND ur.outside = 1
    ORDER BY ur.timestamp DESC
    LIMIT 10 OFFSET ?
    `,
    values: [reservationId, page * 10 - 10],
  })) as any;

  const countRequest = (await query({
    query: `SELECT COUNT(*) as count FROM users_reservations ur WHERE ur.reservationId = ?  AND ur.outside = 1`,
    values: [reservationId],
  })) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const getReservationsByWeekCalendar = async () => {
  const dataRequest = (await query({
    query: `SELECT r.id, r.name, r.from_date, r.to_date, GROUP_CONCAT(ro.id) as rooms, CONCAT(u.first_name, ' ', u.last_name) as leader_name, s.color as status_color, s.display_name as status_name, s.icon as status_icon 
    FROM reservations r
    LEFT JOIN reservations_rooms rr ON rr.reservationId = r.id
    LEFT JOIN rooms ro ON ro.id = rr.roomId
    LEFT JOIN users u ON u.id = r.leader
    LEFT JOIN status s ON s.id = r.status
    WHERE status <> 1
    GROUP BY r.id
    `,
    values: [],
  })) as any;

  return { data: dataRequest };
};

export const getReservationsArchive = async ({ page }: { page: any }) => {
  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `SELECT r.id, r.name, r.from_date, r.to_date, r.creation_date, COUNT(ur.userId) as users_count, u.image as leader_image,
      CONCAT(u.first_name, ' ', u.last_name) as leader_name
      FROM reservations r 
      LEFT JOIN users_reservations ur ON ur.reservationId = r.id
      LEFT JOIN users u ON u.id = r.leader
      WHERE r.status = 1
      GROUP BY r.id
      ORDER BY r.from_date desc
      LIMIT 10 OFFSET ? 
      `,
      values: [page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(r.id) as count FROM reservations r WHERE status = 1`,
      values: [],
    }),
  ])) as any;

  return { data: dataRequest, count: countRequest[0].count };
};

export const createFamilyAccount = async ({
  birth_date,
  first_name,
  last_name,
  adress,
  ID_code,
  email,
}: {
  birth_date: any;
  first_name: any;
  last_name: any;
  adress: any;
  ID_code: any;
  email: any;
}) => {
  const check = (await query({
    query: `SELECT u.id FROM users u WHERE u.ID_CODE = ? AND u.ID_CODE IS NOT NULL`,
    values: [ID_code],
  })) as any;

  if (check.length) {
    return {
      success: false,
      msg: "Tato osoba už má v aplikaci vytvořený účet!",
    };
  }

  const request = (await query({
    query: `INSERT INTO users (first_name, last_name, role, password, email, verified, adress, birth_date, ID_code, children)
    VALUES (?,?,4,NULL,?,1,?,?,?,1)`,
    values: [
      first_name,
      last_name,
      email,
      adress,
      dayjs(birth_date).format("YYYY-MM-DD"),
      ID_code,
    ],
  })) as any;

  return { success: request.affectedRows === 1 };
};

export const getUserFamily = async ({ userId }: { userId: any }) => {
  const dataRequest = (await query({
    query: `SELECT family.id, CONCAT(family.first_name, ' ', family.last_name) as name FROM users u     INNER JOIN users family ON family.email = u.email AND family.children = 1 
    WHERE u.id = ?
    `,
    values: [userId],
  })) as any;

  return { data: dataRequest };
};

export const deleteUser = async ({
  userId,
  reservationId,
}: {
  userId: any;
  reservationId: any;
}) => {
  const [_, request] = (await Promise.all([
    query({
      query: `DELETE FROM users WHERE users.id = ? AND users.role = 4 AND verified = 0`,
      values: [userId],
    }),
    query({
      query: `DELETE FROM users_reservations WHERE users_reservations.userId = ? AND users_reservations.reservationId = ?`,
      values: [userId, reservationId],
    }),
  ])) as any;

  return { success: request.affectedRows === 1 };
};

export const deleteUserWithChildren = async ({
  userId,
  isParent,
}: {
  userId: any;
  isParent: any;
}) => {
  if (!isParent) {
    query({
      query: `DELETE FROM users WHERE id = ?`,
      values: [userId],
    });
    return { success: true };
  }

  query({
    query: `DELETE FROM users WHERE email = (SELECT email FROM users WHERE users.id = ?)`,
    values: [userId],
  });

  return { success: true };
};

export const approveUserInReservation = async ({
  userId,
  reservationId,
}: {
  userId: any;
  reservationId: any;
}) => {
  const [request, _] = (await Promise.all([
    await query({
      query: `UPDATE users_reservations SET verified = true WHERE users_reservations .userId = ? AND users_reservations .reservationId = ?`,
      values: [userId, reservationId],
    }),
    await query({
      query: `UPDATE users SET verified = true WHERE users.id = ?`,
      values: [userId],
    }),
  ])) as any;

  return { success: request.affectedRows === 1 };
};

const approveReservationSendMail = async ({
  reservationId,
}: {
  reservationId: any;
}) => {
  const [data, template] = (await Promise.all([
    query({
      query: `SELECT r.id, r.success_link, r.payment_symbol, r.from_date, r.to_date, r.name, u.email as leader_email, CONCAT(u.first_name, ' ', u.last_name) as leader_name FROM reservations r INNER JOIN users u ON u.id = r.leader WHERE r.id = ?`,
      values: [reservationId],
    }),
    mailEventDetail({ id: 10 }),
  ])) as any;

  await sendEmail({
    send: template.data.active,
    to: data[0].leader_email,
    template: template.data.template,
    variables: [
      {
        name: "reservation_name",
        value: data[0].name,
      },
      {
        name: "reservation_start",
        value: dayjs(data[0].from_date).format("DD. MM. YYYY"),
      },
      {
        name: "reservation_end",
        value: dayjs(data[0].to_date).format("DD. MM. YYYY"),
      },
      {
        name: "outside_link",
        value: data[0].success_link,
      },
      {
        name: "payment_symbol",
        value: data[0].payment_symbol,
      },
    ],
  });
};

const rejectReservationSendMail = async ({
  reservationId,
}: {
  reservationId: any;
}) => {
  const [data, template] = (await Promise.all([
    query({
      query: `SELECT r.id, r.from_date, r.to_date, r.reject_reason, r.name, u.email as leader_email, CONCAT(u.first_name, ' ', u.last_name) as leader_name FROM reservations r INNER JOIN users u ON u.id = r.leader WHERE r.id = ?`,
      values: [reservationId],
    }),
    mailEventDetail({ id: 11 }),
  ])) as any;

  await sendEmail({
    send: template.data.active,
    to: data[0].leader_email,
    template: template.data.template,
    variables: [
      {
        name: "reservation_name",
        value: data[0].name,
      },
      {
        name: "reservation_start",
        value: dayjs(data[0].from_date).format("DD. MM. YYYY"),
      },
      {
        name: "reservation_end",
        value: dayjs(data[0].to_date).format("DD. MM. YYYY"),
      },
      {
        name: "reject_reason",
        value: data[0].reject_reason,
      },
    ],
  });
};

export const createOutsideUser = async ({
  first_name,
  last_name,
  email = null,
  adress = null,
  birth_date = null,
  ID_code = null,
  reservationId,
}: any) => {
  const [checkEmail, checkIdCode] = (await Promise.all([
    query({
      query: `SELECT u.id FROM users u WHERE u.email = ? AND u.email IS NOT NULL`,
      values: [email],
    }),
    query({
      query: `SELECT u.id FROM users u WHERE u.ID_code = ? AND u.ID_code IS NOT NULL`,
      values: [ID_code],
    }),
  ])) as any;

  if (checkEmail.length || checkIdCode.length) {
    return {
      success: false,
      message: "Tento uživatel již v aplikaci existuje!",
    };
  }

  const { insertId } = (await query({
    query: `INSERT INTO users (first_name, last_name, role, email, adress, birth_date, ID_code) VALUES (?,?,4,?,?,?,?)`,
    values: [
      first_name,
      last_name,
      email,
      adress,
      birth_date ? dayjs(birth_date).format("YYYY-MM-DD") : null,
      ID_code,
    ],
  })) as any;

  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `INSERT IGNORE INTO users_reservations (userId, reservationId, verified, outside) VALUES (?,?, 1, 1)`,
      values: [insertId, reservationId],
    }),
  ])) as any;

  return { success: affectedRows === 1 };
};

export const resendRegistraionMail = async ({ user }: any) => {
  const password = Math.random().toString(36).slice(-9) as any;

  const [_, { data }] = (await Promise.all([
    query({
      query: `UPDATE users SET users.password = MD5(?) WHERE users.id = ?`,
      values: [password, user.id],
    }),
    mailEventDetail({ id: 1 }),
  ])) as any;

  const { success } = await sendEmail({
    send: data.active,
    to: [user.email],
    template: data.template,
    variables: [
      { name: "email", value: user.email },
      { name: "password", value: password },
    ],
  });

  return { success };
};

export const getReservationDataOverview = async ({
  from_date = null,
  to_date = null,
}: any) => {
  const fromDate = dayjs(from_date).isValid()
    ? `'${dayjs(from_date).format("YYYY-MM-DD")}'`
    : "NULL";
  const toDate = dayjs(to_date).isValid()
    ? `'${dayjs(to_date).format("YYYY-MM-DD")}'`
    : "NULL";

  const [reservationData] = (await Promise.all([
    query({
      query: `
SELECT 
    p.id, 
    p.image,
    CONCAT(p.first_name, ' ', p.last_name) AS name, 
    (
        SELECT SUM(DATEDIFF(r.to_date, r.from_date))
        FROM users_reservations ur
        INNER JOIN reservations r ON r.id = ur.reservationId
        WHERE ur.userId IN (
            SELECT id FROM users WHERE email = p.email
        )
        AND (r.from_date >= ${fromDate} OR ${fromDate} IS NULL)
        AND (r.to_date <= ${toDate} OR ${toDate} IS NULL)
    ) AS total_nights,
    CONCAT('[', 
        GROUP_CONCAT(
            DISTINCT 
            CASE 
                WHEN IFNULL(user_nights.total_nights, 0) > 0 THEN 
                    JSON_OBJECT(
                        'id', u.id, 
                        'name', CONCAT(u.first_name, ' ', u.last_name),
                        'total_nights', user_nights.total_nights
                    )
                ELSE NULL
            END
        SEPARATOR ','
        ), 
    ']') AS user_detail,
    CONCAT('[', 
        GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
                'id', pr.id, 
                'from_date', pr.from_date, 
                'to_date', pr.to_date,
                'name', pr.name
            )
        SEPARATOR ','
        ), 
    ']') AS reservation_detail
FROM users p
INNER JOIN users u ON u.email = p.email
INNER JOIN users_reservations pur ON pur.userId = p.id
INNER JOIN reservations pr ON pr.id = pur.reservationId 
    AND (pr.from_date >= ${fromDate} OR ${fromDate} IS NULL)
    AND (pr.to_date <= ${toDate} OR ${toDate} IS NULL)
LEFT JOIN (
    SELECT ur.userId, SUM(DATEDIFF(r.to_date, r.from_date)) AS total_nights
    FROM users_reservations ur
    INNER JOIN reservations r ON r.id = ur.reservationId
    WHERE (r.from_date >= ${fromDate} OR ${fromDate} IS NULL)
    AND (r.to_date <= ${toDate} OR ${toDate} IS NULL)
    GROUP BY ur.userId
) AS user_nights ON user_nights.userId = u.id
WHERE p.children = 0 AND p.role <> 4
GROUP BY p.id
ORDER BY total_nights DESC;
      `,
      values: [],
    }),
  ])) as any;

  const data = reservationData.map((user: any) => ({
    ...user,
    user_detail: JSON.parse(user.user_detail),
    reservation_detail: JSON.parse(user.reservation_detail),
  }));

  return { data };
};

export const getSettings = async () => {
  const data = (await query({
    query: `
      SELECT 
        s.main_application_email, 
        s.registration_document_spreadsheet, 
        s.employees_payment, 
        s.public_payment, 
        s.ZO_payment, 
        s.whole_object,
        s.bank_account_number,
        s.payment_symbol_format
      FROM settings s`,
    values: [],
  })) as any;

  return { data: data[0] };
};

export const updateSettings = async (data: any) => {
  try {
    const {
      main_application_email,
      registration_document_spreadsheet,
      whole_object,
      public_payment,
      employees_payment,
      ZO_payment,
      bank_account_number,
      payment_symbol_format,
    } = data;

    const req = (await query({
      query: `UPDATE settings SET 
    main_application_email = ?, 
    registration_document_spreadsheet = ?,
    whole_object = ?,
    public_payment = ?,
    employees_payment = ?,
    ZO_payment = ?,
    bank_account_number = ?,
    payment_symbol_format	= ?
    `,
      values: [
        main_application_email,
        registration_document_spreadsheet,
        whole_object,
        public_payment,
        employees_payment,
        ZO_payment,
        bank_account_number,
        payment_symbol_format,
      ],
    })) as any;

    return { success: req.changedRows };
  } catch (e) {
    if (data.payment_symbol_format.length > 10) {
      return {
        success: false,
        msg: "Formát variabilního symbolu musí mít 10 nebo méně znaků",
      };
    }
    return { success: false };
  }
};

const generatePaymenetSymbol = async (reservationId: any) => {
  const [[{ format }], [data]] = (await Promise.all([
    query({
      query: `SELECT payment_symbol_format as format FROM settings`,
      values: [],
    }),
    query({
      query: `SELECT r.from_date, r.to_date, CONCAT(u.first_name, u.last_name) as name FROM reservations r INNER JOIN users u ON u.id = r.leader WHERE r.id = ?`,
      values: [reservationId],
    }),
  ])) as any;

  const variables = {
    Z: [dayjs(data.from_date).format("DDMMYYYY"), 0],
    K: [dayjs(data.to_date).format("DDMMYYYY"), 0],
    J: [data.name.toLowerCase(), 0],
  };

  let payment_symbol = "";
  for (let i = 0; i < format.length; i++) {
    if (format[i] === "$") {
      // Skip the "$" and move to the next character
      i++;
    }

    const char = format[i];

    if (char) {
      if (char in variables) {
        const [value, count] = variables[char];
        variables[char][1] = count + 1;

        payment_symbol += value[count];
      } else if (char === "N") {
        payment_symbol += String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        );
      } else {
        payment_symbol += char;
      }
    }
  }

  return payment_symbol;
};
