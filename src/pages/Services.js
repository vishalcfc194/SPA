import React from "react";
import services from "../data/services";

const Services = () => {
  return (
    <div>
      <h3>Services</h3>
      <div className="row g-3 mt-3">
        {services.map((s) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={s.id}>
            <div className="card service-card p-3 h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{s.name}</h6>
                  <div className="small text-muted">{s.duration}</div>
                </div>
                <div className="text-end">
                  <div className="fw-bold">₹{s.price || "Call"}</div>
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-sm btn-outline-success">
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
