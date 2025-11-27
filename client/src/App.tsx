import { ApolloProvider } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./lib/auth.js";
import { apolloClient } from "./lib/graphql/queries.js";
import { NavBar } from "./components/NavBar.js";
import { CompanyPage } from "./pages/CompanyPage.js";
import { CreateJobPage } from "./pages/CreateJobPage.js";
import { HomePage } from "./pages/HomePage.js";
import { JobPage } from "./pages/JobPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { User } from "./models/shared.js";

export const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getUser());

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <ApolloProvider client={apolloClient}>
      <NavBar user={user} onLogout={handleLogout} />
      <main className="section">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/companies/:companyId" element={<CompanyPage />} />
          <Route path="/jobs/new" element={<CreateJobPage />} />
          <Route path="/jobs/:jobId" element={<JobPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </main>
    </ApolloProvider>
  );
}