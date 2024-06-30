import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
type param = {
    subtotal:number, 
    grandTotal:number,
    tax:number,
    totalLessons:number,
    discount:number,
    clientName:string,
    startDate:string,
    endDate:string,
    courses:any[]
}

export const downloadPDFResume = ({
    subtotal, 
    grandTotal,
    tax,
    totalLessons,
    discount,
    clientName,
    startDate,
    endDate,
    courses
}:param) => {

    //dailyApiFiltered.sort((a, b) => new Date(a.courseDate) - new Date(b.courseDate));
    const doc = new jsPDF();

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');

    const headers = [['ID','Date', 'Note', 'Horse Name', 'Price']];
    
    const data =courses.map((course, index) => [index + 1, course.courseDate, course.note , course.hourseId.hourseName, course.price]);
  

    doc.addImage('/images/logo-png.png', 'PNG', 10, 10, 50, 50);
    doc.text("Client Name:", 125, 30);
    doc.text("Start Date:", 125, 40);
    doc.text("End Date:", 125, 50);
    doc.text(clientName, 155, 30);
    doc.text(startDate, 155, 40);
    doc.text(endDate, 155, 50);

    const recordsPerPage = 23; // Adjust the number of records per page as needed
    let currentPage = 1;
    let dataIndex = 0;

    const drawTable = () => {
      const tableData = data.slice(dataIndex, dataIndex + recordsPerPage);
      if (tableData.length > 0) {
        autoTable(doc,{
          head: headers,
          body: tableData,
          theme: 'grid',
          startY: 63, // Adjust the startY position as needed
        });
        currentPage++;
        dataIndex += recordsPerPage;
        if (dataIndex < data.length) {
          doc.addPage();
          drawTable();
        }
      }
    };

    drawTable();

    // Draw grid-like rectangles for the text sections
    const startX = doc.internal.pageSize.getWidth() / 1.5;
    const startZ = doc.internal.pageSize.getHeight() / 1.11;
    const lineHeight = 5;
    const padding = 1.5;
    const rectWidth = 60;
    const rectHeight = lineHeight + padding;

    // Draw rectangles around the text sections
    doc.rect(startX - padding, startZ - 5, rectWidth, rectHeight).setDrawColor(0);
    doc.rect(startX - padding, startZ + 1.7, rectWidth, rectHeight).setDrawColor(0);
    doc.rect(startX - padding, startZ + 8.4, rectWidth, rectHeight).setDrawColor(0);
    doc.rect(startX - padding, startZ + 15.1, rectWidth, rectHeight).setDrawColor(0);
    doc.rect(startX - padding, startZ + 21.8, rectWidth, rectHeight).setDrawColor(0);

    doc.text(`Total Lessons:   JOD ${totalLessons.toFixed(2)}`, startX, doc.internal.pageSize.getHeight() / 1.11, { align: "left" });
    doc.text(`Discount:     % ${discount}`, startX, doc.internal.pageSize.getHeight() / 1.085, { align: "left" });
    doc.text(`Sub-Total:         JOD ${subtotal.toFixed(2)}`, startX, doc.internal.pageSize.getHeight() / 1.06, { align: "left" });
    doc.text(`Tax 16(%):          JOD ${tax.toFixed(2)}`, startX, doc.internal.pageSize.getHeight() / 1.035, { align: "left" });
    doc.text(`Grand Total:      JOD ${grandTotal.toFixed(2)}`, startX, doc.internal.pageSize.getHeight() / 1.01, { align: "left" });

    doc.text("Please Make Cheques Payable To:", doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.11);
    doc.text("International Equestrian Academy Company", doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.085);
    doc.text("P.O. Box 926028 - Amman, Jordan - 11190", doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.06);
    doc.text("Phone: (00962) 777 44 2222", doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.035);
    doc.text("E-Mail: Info@SaifiStables.com", doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.01);

    doc.save('invoice.pdf');
    window.location.reload();

};

//   const handleDownloadFamily = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');

//     const headers = [['Date', 'Description', 'Horse Name', 'Debit']];

//     const data = dailyApiFiltered.map(daily => [daily.courseDate, daily.course, daily.horseName, daily.price]);
//     const subTotal = subTotalValue;
//     const tax = taxValue;
//     const grandTotal = grandTotalValue;
//     const discount = selectedDiscount;
//     const totalLessons = coursePrices;

//     doc.addImage(logo, 'PNG', 10, 10, 50, 50);
//     doc.text("Client Name:", 125, 30);
//     doc.text("Start Date:", 125, 40);
//     doc.text("End Date:", 125, 50);
//     doc.text(selectedClient, 155, 30);
//     doc.text(startDate, 155, 40);
//     doc.text(endDate, 155, 50);

//     autoTable(doc,{
//       head: headers,
//       body: data,
//       startY: 70,
//       theme: 'plain',
//     });

//     doc.text(`Total Lessons: JOD ${totalLessons.toFixed(2)}`, doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.29);
//     doc.text(`Discount: % ${discount}`, doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.26);
//     doc.text(`Sub-Total: JOD ${subTotal.toFixed(2)}`, doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.23);
//     doc.text(`Tax 16(%): JOD ${tax.toFixed(2)}`, doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.20);
//     doc.text(`Grand Total: JOD ${grandTotal.toFixed(2)}`, doc.internal.pageSize.getWidth() / 15, doc.internal.pageSize.getHeight() / 1.17);

//     doc.text("Please Make Cheques Payable To:", doc.internal.pageSize.getWidth() / 3, doc.internal.pageSize.getHeight() / 1.11);
//     doc.text("International Equestrian Academy Company", doc.internal.pageSize.getWidth() / 3.45, doc.internal.pageSize.getHeight() / 1.09);
//     doc.text("P.O. Box 926028 - Amman, Jordan - 11190", doc.internal.pageSize.getWidth() / 3.4, doc.internal.pageSize.getHeight() / 1.07);
//     doc.text("Phone: (00962) 777 44 2222", doc.internal.pageSize.getWidth() / 2.70, doc.internal.pageSize.getHeight() / 1.05);
//     doc.text("E-Mail: Info@SaifiStables.com", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 1.03, { align: "center" });

//     doc.save('invoice.pdf');
//   };