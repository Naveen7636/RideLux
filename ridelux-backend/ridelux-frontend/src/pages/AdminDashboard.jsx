import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserRound,
  CarFront,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [processingId, setProcessingId] = useState(null);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [usersResponse, driversResponse] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/users/admin/pending-drivers`),
      ]);

      setUsers(usersResponse.data);
      setPendingDrivers(driversResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin data. Check the backend API."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateDriver(id, status) {
    setProcessingId(id);
    setError("");

    try {
      await axios.patch(
        `${API}/users/admin/drivers/${id}/approval`,
        { status }
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update driver approval. The API may not be implemented yet."
      );
    } finally {
      setProcessingId(null);
    }
  }

  const passengers = users.filter(
    (user) => user.role === "PASSENGER"
  ).length;

  const drivers = users.filter(
    (user) => user.role === "DRIVER"
  ).length;

  const admins = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  function logout() {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#171717]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-black/10 bg-white p-6 md:flex">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7ff65]">
            <CarFront size={23} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              RideLux
            </h1>
            <p className="text-xs text-gray-500">Admin Console</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
          Workspace
        </p>

        {[
          { id: "overview", label: "Overview", icon: Users },
          {
            id: "drivers",
            label: "Driver approvals",
            icon: Clock3,
          },
          { id: "users", label: "All users", icon: UserRound },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              activeTab === id
                ? "bg-[#d7ff65] text-black"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Icon size={18} />
            {label}
            {id === "drivers" && pendingDrivers.length > 0 && (
              <span className="ml-auto rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {pendingDrivers.length}
              </span>
            )}
          </button>
        ))}

        <div className="mt-auto rounded-2xl bg-[#f5f5f2] p-4">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="text-sm font-bold">Admin workspace</span>
          </div>
          <p className="text-xs leading-5 text-gray-500">
            Manage RideLux users and driver verification.
          </p>
          <button
            onClick={logout}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black"
          >
            <LogOut size={16} />
            Back to login
          </button>
        </div>
      </aside>

      <main className="md:ml-64">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              RideLux / Administration
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              {activeTab === "overview"
                ? "Dashboard overview"
                : activeTab === "drivers"
                ? "Driver approvals"
                : "User management"}
            </h2>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="p-5 sm:p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-black/5 bg-white p-10 text-center text-gray-500">
              Loading RideLux data...
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <>
                  <div className="mb-8">
                    <p className="text-sm text-gray-500">
                      Here's what's happening across your platform.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Total users",
                        value: users.length,
                        icon: Users,
                      },
                      {
                        label: "Passengers",
                        value: passengers,
                        icon: UserRound,
                      },
                      {
                        label: "Drivers",
                        value: drivers,
                        icon: CarFront,
                      },
                      {
                        label: "Pending approvals",
                        value: pendingDrivers.length,
                        icon: Clock3,
                      },
                    ].map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-black/5 bg-white p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {label}
                          </span>
                          <div className="rounded-xl bg-[#f5f5f2] p-2.5">
                            <Icon size={19} />
                          </div>
                        </div>
                        <p className="mt-5 text-3xl font-extrabold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <section className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">
                          Driver verification queue
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Review new driver registrations.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("drivers")}
                        className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        Review drivers
                      </button>
                    </div>

                    {pendingDrivers.length === 0 ? (
                      <p className="mt-6 rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                        No pending drivers returned by the API.
                      </p>
                    ) : (
                      <div className="mt-5 space-y-3">
                        {pendingDrivers.slice(0, 5).map((driver) => (
                          <DriverRow
                            key={driver.id}
                            driver={driver}
                            processing={processingId === driver.id}
                            onApprove={() =>
                              updateDriver(driver.id, "APPROVED")
                            }
                            onReject={() =>
                              updateDriver(driver.id, "REJECTED")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}

              {activeTab === "drivers" && (
                <section className="rounded-2xl border border-black/5 bg-white p-5 sm:p-7">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold">
                      Pending driver applications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Approve or reject a driver's registration.
                    </p>
                  </div>

                  {pendingDrivers.length === 0 ? (
                    <p className="rounded-xl bg-gray-50 p-6 text-sm text-gray-500">
                      No pending drivers found.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pendingDrivers.map((driver) => (
                        <DriverRow
                          key={driver.id}
                          driver={driver}
                          processing={processingId === driver.id}
                          onApprove={() =>
                            updateDriver(driver.id, "APPROVED")
                          }
                          onReject={() =>
                            updateDriver(driver.id, "REJECTED")
                          }
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {activeTab === "users" && (
                <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                  <div className="border-b border-black/5 p-5 sm:p-7">
                    <h3 className="text-lg font-bold">Registered users</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {users.length} accounts found
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-5 py-4">User</th>
                          <th className="px-5 py-4">Phone</th>
                          <th className="px-5 py-4">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-t border-black/5"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold">{user.name}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                {user.email}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {user.phone || "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <p className="mt-8 text-center text-xs text-gray-400">
                RideLux Admin Console · {admins} admin account
                {admins === 1 ? "" : "s"} in the user list
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function DriverRow({ driver, processing, onApprove, onReject }) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-black/5 p-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-bold">{driver.name}</p>
        <p className="mt-1 text-sm text-gray-500">{driver.email}</p>
        <p className="mt-1 text-xs text-gray-400">
          Phone: {driver.phone || "Not provided"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApprove}
          disabled={processing}
          className="flex items-center gap-2 rounded-lg bg-[#d7ff65] px-3 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          <CheckCircle2 size={16} />
          Approve
        </button>

        <button
          onClick={onReject}
          disabled={processing}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}