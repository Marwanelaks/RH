export type Employee = {
    id: string;
    position: string;
    department: string;
    startDate: Date;
    salary: number;
    userId: string;
    managerId?: string;
    user: {
      name: string;
      email: string;
      role: string;
    };
    manager?: {
      user: {
        name: string;
      };
    };
  };
  
  export type EmployeeFormData = {
    name: string;
    email: string;
    position: string;
    department: string;
    startDate: string;
    salary: string;
    password: string;
    managerId?: string;
  };