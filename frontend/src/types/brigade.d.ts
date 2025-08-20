declare interface Brigade {
  id: number;
  name: string;
  users: User[];
  companyId: number | null;
  createdAt: string;
  updatedAt: string;
}

declare interface BrigadeData {
  name: string;
  companyId: number | null;
}

declare interface BrigadeCardProps {
  id: number;
  name: string;
  userCount: number;
  onClick: () => void;
}
