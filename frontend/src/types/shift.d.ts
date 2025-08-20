declare interface Shift {
  id: number;
  status: string;
  startedAt: string;
  endedAt: string;
  durationHours: number;
  user: {
    name: string;
    email: string;
  };
  company: {
    name: string;
  };
  brigade: {
    name: string;
  } | null;
}

declare interface ShiftCardProps {
  id: number;
  status: string;
  startedAt: string;
  endedAt: string;
  durationHours: number;
  user: {
    name: string;
    email: string;
  };
  company: {
    name: string;
  };
  brigade: {
    name: string;
  } | null;
  onClick?: () => void;
}
