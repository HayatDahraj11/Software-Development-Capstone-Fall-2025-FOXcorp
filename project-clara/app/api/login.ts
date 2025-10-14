// app/api/login.ts

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
};


// Mock user database
const mockUsers = [
  { email: "parent@test.com", password: "password123" },
  { email: "parent2@test.com", password: "password123" },
];

export function loginApi({ email, password }: LoginRequest): Promise<LoginResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        resolve({ success: true, message: "Login successful" });
      } else {
        resolve({ success: false, message: "Invalid email or password" });
      }
    }, 1000); // simulate network delay
  });
}
