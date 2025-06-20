export type HouseType = {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  image?: string;
};

export type SubjectType = {
  _id: string;
  title: string;
  createdBy: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    email: string;
    role: string;
  };
};
