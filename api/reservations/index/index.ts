import { requireAuthServerSession } from "@/lib/authServerSession";
import { query } from "@/lib/db";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";

export const getReservationList = async (
  searchParams: Awaited<ServerSideComponentProp["searchParams"]>
) => {
  const { page = "1", status, search, registration, user, group, sort = "", dir = "" } = searchParams;

  const allowedSort = [
    "r.name",
    "r.creation_date",
    "r.from_date",
    "r.to_date",
    "users_count",
  ];

  const currentUser = await requireAuthServerSession();

  const [dataRequest, countRequest] = (await Promise.all([
    query({
      query: `  
        SELECT r.id, r.name, r.from_date, r.to_date, r.creation_date, CONCAT(u.first_name, ' ', u.last_name) as leader_name, u.image as leader_image, u.id as leader_id,
                s.icon as status_icon, s.color as status_color, s.display_name as status_name, r.status, r.reject_reason, r.success_link,
               (SELECT COUNT(*) FROM users_reservations ur WHERE ur.reservationId = r.id AND ur.verified = 1) AS users_count,
               (SELECT SUM(ro.people) 
                FROM reservations_rooms rr 
                LEFT JOIN rooms ro ON ro.id = rr.room 
                WHERE rr.reservationId = r.id) AS beds_count,
                (SELECT EXISTS (SELECT rf.user_id FROM reservations_forms rf WHERE rf.reservation_id = r.id)) as active_registration
        FROM reservations r
        LEFT JOIN users u ON u.id = r.leader
        LEFT JOIN reservations_forms rf ON rf.reservation_id = r.id
        INNER JOIN status s ON s.id = r.status
        ${user ? `INNER JOIN users_reservations ur ON ur.reservationId = r.id` : ''}
        ${group ? `INNER JOIN reservations_groups rg ON rg.reservationId = r.id` : ''}
        WHERE 1=1
              ${status ? `AND r.status = "${status}"` : ""}
              ${search ? `AND r.name LIKE "%${search}%"` : ""}
              ${
                registration
                  ? `AND ${
                      registration === "0" ? "NOT" : ""
                    } EXISTS (SELECT 1 FROM reservations_forms rf WHERE rf.reservation_id = r.id)`
                  : ""
              }
              ${user ? `AND ur.userId = ${user}` : ''}
        ${group ? `AND rg.groupId = ${group}` : ''}
        GROUP BY r.id
        ${
          dir !== "" && allowedSort.includes(sort)
            ? `ORDER BY ${sort} ${dir}`
            : "ORDER BY r.creation_date desc"
        }
        LIMIT 10 OFFSET ?
      `,
      values: [Number(page) * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(r.id) as count FROM reservations r
      ${user ? `INNER JOIN users_reservations ur ON ur.reservationId = r.id` : ''}
      ${group ? `INNER JOIN reservations_groups rg ON rg.reservationId = r.id` : ''}
      WHERE 1=1
      ${status ? `AND r.status = "${status}"` : ""}
      ${search ? `AND r.name LIKE "%${search}%"` : ""}
      ${
        registration
          ? `AND ${
              registration === "0" ? "NOT" : ""
            } EXISTS (SELECT 1 FROM reservations_forms rf WHERE rf.reservation_id = r.id)`
          : ""
      }
      ${user ? `AND ur.userId = ${user}` : ''}
      ${group ? `AND rg.groupId = ${group}` : ''}
      `,
      values: [],
    }),
  ])) as any;
  return { data: dataRequest, count: countRequest[0].count };
};
