import React from "react";

const Topbar = () => {
  return (
    <header className="topbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white">
      <div className="d-flex align-items-center">
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
        <div className="me-3 text-end">
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
