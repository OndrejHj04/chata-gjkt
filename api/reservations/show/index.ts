import { query } from "@/lib/db";

export const getReservationDetail = async (id: string) => {
  const req = (await query({
    query: `SELECT r.id, r.name, r.from_date, r.to_date, r.purpouse, u.image as leader_image, CONCAT(u.first_name, ' ', u.last_name) as leader_name,
    u.email as leader_email, s.display_name as status_name, s.icon as status_icon, s.color as status_color, r.success_link, r.payment_symbol, r.reject_reason, s.id as status_id, r.instructions, u.id as leader_id, GROUP_CONCAT(rr.room) as rooms
    FROM reservations r
    LEFT JOIN users u ON u.id = r.leader
    LEFT JOIN status s ON s.id = r.status
    LEFT JOIN reservations_rooms rr ON rr.reservationId = r.id
    WHERE r.id = ?`,
    values: [id],
  })) as any;

  return {
    ...req[0],
    rooms: req[0].rooms.split(",")
  }
};
