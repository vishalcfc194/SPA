import React from "react";

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="topbar d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-secondary me-2 d-md-none"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <img src="/logo.png" alt="logo" className="logo-img me-3" />
        <div>
          <h5 className="m-0" style={{ fontFamily: "Poppins" }}>
            Cindrella The Family Spa
          </h5>
          <small className="text-muted">
            Near IDBI Bank, Queen Place 2nd Floor
          </small>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="me-3 text-end d-none d-md-block">
          <div className="fw-bold">7440534727</div>
          <div className="small text-muted">
            cindrellathefamilyspa@gmail.com
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
