export const BASE_URL = "https://shiftapp.onrender.com";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login", // Authenticate user and return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users
    GET_USER_BY_ID: (userId: string) => `/api/users/${userId}`, // Get user by ID
    GET_USER_BY_BRIGADE: (brigadeId: string) =>
      `/api/brigades/${brigadeId}/users`, // Get user by brigade
    CREATE_USER: "/api/users/create", // Create a new user
    UPDATE_USER: (userId: string) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId: string) => `/api/users/${userId}`, // Delete a user
  },

  BRIGADES: {
    GET_ALL_BRIGADES: "/api/brigades",
    CREATE_BRIGADE: "api/brigades/create",
    UPDATE_BRIGADE: (brigadeId: string) => `/api/brigades/${brigadeId}`,
    GET_BRIGADE_BY_ID: (brigadeId: string) => `/api/brigades/${brigadeId}`,
    DELETE_BRIGADE: (brigadeId: string) => `/api/brigades/${brigadeId}`,
  },

  SHIFTS: {
    GET_ALL_SHIFTS: "/api/shifts/", // Get All Shifts
    GET_USERS_SHIFTS: (userId: string) => `/api/shifts/user/${userId}`, // Get User's shifts
  },

  COMPANIES: {
    GET_ALL_COMPANIES: "/api/companies", // Get All Companies
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel file
    EXPORT_USERS: "/api/reports/export/users", // Download user-task report
  },
};
