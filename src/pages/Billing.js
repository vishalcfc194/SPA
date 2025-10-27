import React, { useEffect, useState, useRef } from "react";
import services from "../data/services";
import { load, save } from "../utils/storage";
import { generatePDFBill } from "../utils/pdf";
import ModalPortal from "../components/ModalPortal";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [form, setForm] = useState({
    client: "",
    phone: "",
    address: "",
    serviceId: "",
    staff: "",
    amount: 0,
    date: todayISO,
    from: "",
    to: "",
  });

  // helper: return current time as HH:MM
  const getCurrentTimeHHMM = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const parseDurationMinutes = (duration) => {
    if (!duration) return 0;
    const m = duration.match(/(\d+)/);
    return m ? Number(m[0]) : 0;
  };

  const addMinutesToTime = (timeStr, minutesToAdd) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(Number(h));
    date.setMinutes(Number(m) + Number(minutesToAdd));
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  useEffect(() => {
    setBills(load("bills", []));
    const existingStaff = load("staff", []);
    const defaults = [
      { id: 1, name: "Elli", role: "Therapist", contact: "" },
      { id: 2, name: "Jasmin", role: "Therapist", contact: "" },
      { id: 3, name: "Muskan", role: "Therapist", contact: "" },
      { id: 4, name: "Yamini", role: "Therapist", contact: "" },
    ];
    if (!existingStaff || existingStaff.length === 0) {
      setStaffList(defaults);
      save("staff", defaults);
    } else {
      // merge defaults (by name) to ensure they exist without duplicates
      const existingNames = new Set(existingStaff.map((s) => s.name));
      const merged = [...existingStaff];
      defaults.forEach((d) => {
        if (!existingNames.has(d.name)) merged.push(d);
      });
      setStaffList(merged);
      save("staff", merged);
    }
    return () => {
      document.body.classList.remove("modal-open-blur");
    };
  }, []);

  const openModal = () => {
    setForm({
      client: "",
      phone: "",
      address: "",
      serviceId: "",
      staff: "",
      amount: 0,
      date: todayISO,
      from: getCurrentTimeHHMM(),
      to: "",
    });
    setShowModal(true);
    document.body.classList.add("modal-open-blur");
  };

  const handleServiceChange = (e) => {
    const id = Number(e.target.value);
    const svc = services.find((s) => s.id === id);
    setForm((prev) => ({
      ...prev,
      serviceId: id,
      serviceName: svc ? svc.name : "",
      amount: svc ? svc.price : 0,
      to:
        svc && prev.from
          ? addMinutesToTime(prev.from, parseDurationMinutes(svc.duration))
          : prev.to,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    const bill = { ...form, id: Date.now(), total: Number(form.amount) };
    const updated = [bill, ...bills];
    setBills(updated);
    save("bills", updated);
    setShowModal(false);
    document.body.classList.remove("modal-open-blur");
    // generate PDF and open in new tab
    generatePDFBill(bill);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Billing</h3>
        <button className="btn btn-primary" onClick={openModal}>
          + Add Bill
        </button>
      </div>

      <div className="card mt-3 p-3">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Service</th>
                <th>Staff</th>
                <th>Amount</th>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 && (
                <tr>
                  <td colSpan={7}>No bills yet</td>
                </tr>
              )}
              {bills.map((b) => (
                <tr key={b.id}>
                  <td>{b.client}</td>
                  <td>
                    {services.find((s) => s.id === Number(b.serviceId))?.name ||
                      ""}
                  </td>
                  <td>{b.staff}</td>
                  <td>₹{b.total}</td>
                  <td>
                    {new Date(b.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{b.from}</td>
                  <td>{b.to}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => generatePDFBill(b)}
                      title="Open PDF"
                    >
                      📄
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => generatePDFBill(b, { action: "print" })}
                      title="Print PDF"
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalPortal>
          <div className="modal-backdrop show">
            <div className="modal d-block" tabIndex={-1}>
              <div className="modal-dialog modal-lg-custom">
                <form onSubmit={submit} className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Bill</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowModal(false);
                        document.body.classList.remove("modal-open-blur");
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="form-label">Client Name</label>
                        <input
                          className="form-control"
                          value={form.client}
                          placeholder="Enter client name"
                          onChange={(e) =>
                            setForm({ ...form, client: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Client Phone</label>
                        <input
                          className="form-control"
                          value={form.phone}
                          placeholder="Mobile number"
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Client Address</label>
                        <input
                          className="form-control"
                          value={form.address}
                          placeholder="Client address"
                          onChange={(e) =>
                            setForm({ ...form, address: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      <div className="col-md-4">
                        <label className="form-label">Service</label>
                        <select
                          className="form-select"
                          value={form.serviceId}
                          onChange={handleServiceChange}
                          required
                        >
                          <option value="">Select service</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} - ₹{s.price}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Staff</label>
                        <select
                          className="form-select"
                          value={form.staff}
                          onChange={(e) =>
                            setForm({ ...form, staff: e.target.value })
                          }
                        >
                          <option value="">Select staff</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} - {s.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Amount</label>
                        <input
                          className="form-control"
                          type="number"
                          value={form.amount}
                          placeholder="Amount (auto or edit)"
                          onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      <div className="col-md-4">
                        <label className="form-label">Date</label>
                        <input
                          className="form-control"
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm({ ...form, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">From Time</label>
                        <input
                          className="form-control"
                          type="time"
                          value={form.from}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              from: e.target.value,
                              to: form.serviceId
                                ? addMinutesToTime(
                                    e.target.value,
                                    parseDurationMinutes(
                                      services.find(
                                        (s) => s.id === Number(form.serviceId)
                                      )?.duration
                                    )
                                  )
                                : form.to,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">To Time</label>
                        <input
                          className="form-control"
                          type="time"
                          value={form.to}
                          onChange={(e) =>
                            setForm({ ...form, to: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Total Amount</label>
                      <input
                        className="form-control"
                        value={form.amount}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Generate Bill
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

export default Billing;
