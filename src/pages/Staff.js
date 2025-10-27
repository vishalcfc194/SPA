import React, { useEffect, useState } from "react";
import { load, save } from "../utils/storage";
import ModalPortal from "../components/ModalPortal";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    contact: "",
    status: "Active",
  });

  useEffect(() => {
    setStaff(load("staff", []));
    return () => document.body.classList.remove("modal-open-blur");
  }, []);

  const add = (e) => {
    e.preventDefault();
    const s = { ...form, id: Date.now() };
    const updated = [s, ...staff];
    setStaff(updated);
    save("staff", updated);
    setShow(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Staff</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShow(true);
            document.body.classList.add("modal-open-blur");
          }}
        >
          + Add Staff
        </button>
      </div>

      <div className="card mt-3 p-3">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 && (
                <tr>
                  <td colSpan={4}>No staff yet</td>
                </tr>
              )}
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.role}</td>
                  <td>{s.contact}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
        <ModalPortal>
          <div className="modal-backdrop show">
            <div className="modal d-block">
              <div className="modal-dialog modal-lg-custom">
                <form className="modal-content" onSubmit={add}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add Staff</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShow(false);
                        document.body.classList.remove("modal-open-blur");
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        required
                      >
                        <option value="">Select role</option>
                        <option>Therapist</option>
                        <option>Reception</option>
                        <option>Manager</option>
                        <option>Cleaner</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Contact</label>
                      <input
                        className="form-control"
                        value={form.contact}
                        onChange={(e) =>
                          setForm({ ...form, contact: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShow(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default Staff;
