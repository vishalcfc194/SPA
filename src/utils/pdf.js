import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatDateReadable = (isoDate) => {
  try {
    const d = new Date(isoDate);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return isoDate || "";
  }
};

// options: { action: 'open'|'print' }
export const generatePDFBill = async (bill, options = { action: "open" }) => {
  try {
    // Build HTML invoice in-memory
    const invoiceHtml = `
        <div style="font-family: Poppins, Arial; padding:20px; background: white; width:800px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="/logo.png" style="height:64px;" alt="logo" />
            <div>
              <h2 style="color:#2b6a53; margin:0;">Cindrella The Family Spa</h2>
              <div style="color:#666; font-size:13px">Near IDBI Bank, Queen Place 2nd Floor</div>
              <div style="color:#666; font-size:13px">Mobile: 7440534727 | Email: cindrellathefamilyspa@gmail.com</div>
            </div>
          </div>
        <hr />
          <div style="display:flex; justify-content:space-between; margin-top:10px;">
          <div>
            <strong>Client:</strong> ${bill.client}<br />
            <strong>Phone:</strong> ${bill.phone || ""}<br />
            <strong>Address:</strong> ${bill.address || ""}
          </div>
          <div style="text-align:right;">
            <strong>Date:</strong> ${formatDateReadable(bill.date) || ""}<br />
            <strong>Time:</strong> ${bill.from || ""} - ${bill.to || ""}<br />
            <strong>Staff:</strong> ${bill.staff || ""}
          </div>
        </div>
        <table style="width:100%; margin-top:20px; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left; border-bottom:1px solid #ddd; padding-bottom:8px">Service</th>
              <th style="text-align:right; border-bottom:1px solid #ddd; padding-bottom:8px">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td style="padding:8px 0">${
                  bill.serviceName || bill.serviceId
                }</td>
              <td style="text-align:right">₹${bill.total}</td>
            </tr>
          </tbody>
        </table>
        <div style="display:flex; justify-content:flex-end; margin-top:20px;">
          <div style="width:300px;">
            <div style="display:flex; justify-content:space-between;"><div>Total</div><div><strong>₹${
              bill.total
            }</strong></div></div>
          </div>
        </div>
        <hr />
        <div style="text-align:center; margin-top:20px; color:#777">Thank You! Visit Again 💆‍♀️</div>
      </div>
    `;

    // Create a DOM node
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.innerHTML = invoiceHtml;
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    if (options.action === "print") {
      // Print directly
      pdf.autoPrint();
      const blobUrl = pdf.output("bloburl");
      const w = window.open(blobUrl);
      // For some browsers, autoPrint opens print dialog automatically
      return;
    }

    // open in new tab
    const blob = pdf.output("bloburl");
    window.open(blob, "_blank");

    // cleanup
    document.body.removeChild(wrapper);
  } catch (e) {
    console.error("PDF generation error", e);
  }
};
