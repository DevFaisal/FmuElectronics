import { Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import formatCurrency from "./formatCurrency";

interface Item {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

export async function printToPdf(customerName: string, items: Item[]) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            padding: 20px; 
            color: #333;
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px;
          }
          h1 { 
            font-size: 24px; 
            color: #1a5f7a; 
            margin: 0;
          }
          .tagline {
            font-style: italic;
            color: #666;
            margin-top: 5px;
            font-size: 10px;
          }
          .info { 
            margin-bottom: 20px; 
            display: flex;
            justify-content: space-between;
          }
          .info-section {
            flex: 1;
          }
          .info-section:last-child {
            text-align: right;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 6px; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          .total { 
            font-size: 14px; 
            font-weight: bold; 
            margin-top: 10px; 
            text-align: right; 
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FMU Electronics</h1>
          <p class="tagline">Your One-Stop Shop for Electronics Repair and Electrical Fittings</p>
        </div>
        <div class="info">
          <div class="info-section">
            <p><strong>Proprietor:</strong> Mudasir Farooq</p>
            <p><strong>Phone:</strong> 8899821659</p>
            <p><strong>Address:</strong> Jamia Qadeem Sopore</p>
          </div>
          <div class="info-section">
            <p><strong>Invoice Date:</strong> ${currentDate}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Invoice #:</strong> INV-${Math.floor(
              Math.random() * 10000
            )
              .toString()
              .padStart(4, "0")}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                        <td>${formatCurrency(parseFloat(item.price))}</td>
                <td>${formatCurrency(
                  parseFloat(item.price) * parseInt(item.quantity)
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <p class="total">
          Total:${formatCurrency(
            items.reduce(
              (sum, item) =>
                sum + parseFloat(item.price) * parseInt(item.quantity),
              0
            )
          )}
        </p>
        <div class="footer">
          <p>FMU Electronics - Your trusted partner for all kinds of electronic repairs and electrical fittings.</p>
          <p>We offer a wide range of electronic items and services. Thank you for your business!</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  } catch (error) {
    Alert.alert("Error", "An error occurred while generating the PDF.");
  }
}
