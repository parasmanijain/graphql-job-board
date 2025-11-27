import { useState, FormEvent } from "react";
import { login } from "../lib/auth.js";
import { User } from "../models/shared.js";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    const user = await login(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="message is-danger">
          <p className="message-body">Login failed</p>
        </div>
      )}

      <div className="field">
        <div className="control">
          <button type="submit" className="button is-link">
            Login
          </button>
        </div>
      </div>
    </form>
  );
}