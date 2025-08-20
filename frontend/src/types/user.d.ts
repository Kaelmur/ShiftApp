declare interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  brigade: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  onClick: () => void;
}

declare interface UserData {
  name: string;
  email: string;
  password: string;
  role?: "WORKER" | "ADMIN";
  companyId: number;
  brigadeId: number;
}

declare interface UserCardProps {
  userInfo: User;
  onClick?: () => void;
}
