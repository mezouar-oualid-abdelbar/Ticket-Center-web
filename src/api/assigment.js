// import { http } from "./http";

export const assigmentApi = {
  getAssigments: () => [
    {
      id: 1,
      task: "Complete React table component",
      status: "Pending",
      groupid: null,
    },
    {
      id: 2,
      task: "Fix login page bug",
      status: "In Progress",
      groupid: 1,
    },
    {
      id: 3,
      task: "Design dashboard widgets",
      status: "Completed",
      groupid: 1,
    },
  ],
  getAssigment(id) {
    if (id === 1) {
      return {
        id: 1,
        task: "Complete React table component",
        status: "Pending",
        groupid: null,
      };
    }
    return {
      id: 2,
      task: "Fix login page bug",
      status: "In Progress",
      groupid: null,
    };
  },
};
