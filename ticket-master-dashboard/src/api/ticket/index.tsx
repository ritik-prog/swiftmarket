import instance from "../../utils/Axios";

// get all tickets
export const getAllTickets = async () => {
  const res = await instance.get("/ticketmaster/tickets");
  return res.data;
};
