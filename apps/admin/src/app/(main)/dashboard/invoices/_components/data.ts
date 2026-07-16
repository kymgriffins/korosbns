import { addDays, format } from "date-fns";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTaxOption {
  id: string;
  name: string;
  rate: number;
}

export type InvoiceDiscountType = "fixed" | "percent";

export const INVOICE_PAPER_WIDTH = 816;
export const INVOICE_PAPER_HEIGHT = 1056;
export const INVOICE_PAPER_SCALE = 0.6;

export interface InvoiceFromDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  paymentAccountName: string;
  routingNumber: string;
  issuerName: string;
}

export interface InvoiceToDetails {
  id: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
}

export interface InvoiceFormValues {
  referenceNumber: string;
  issuedDate: string;
  paymentDueDate: string;
  from: InvoiceFromDetails;
  to: InvoiceToDetails;
  taxId: string;
  discountType: InvoiceDiscountType;
  discountValue: number;
  items: InvoiceLineItem[];
}

const today = new Date();

export const defaultInvoiceValues: InvoiceFormValues = {
  referenceNumber: `INV-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-001`,
  issuedDate: format(today, "yyyy-MM-dd"),
  paymentDueDate: format(addDays(today, 30), "yyyy-MM-dd"),
  from: {
    name: "Budget & Ndio Story",
    email: "finance@budgetndiostory.ke",
    phone: "+254-20-000-0000",
    website: "budgetndiostory.ke",
    addressLines: ["P.O. Box 00000-00100", "Nairobi, Kenya"],
    taxId: "KRA-PIN-P000000000Z",
    paymentAccountName: "Budget Ndio Story Operating",
    routingNumber: "000-000-000",
    issuerName: "Finance Dept",
  },
  to: {
    id: "client-new",
    name: "",
    email: "",
    addressLines: [],
    taxId: "",
  },
  taxId: "vat-16",
  discountType: "fixed",
  discountValue: 0,
  items: [
    {
      id: "item-1",
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
};

export const invoiceTaxOptions: InvoiceTaxOption[] = [
  {
    id: "vat-16",
    name: "VAT (16%)",
    rate: 16,
  },
  {
    id: "vat-8",
    name: "VAT (8%)",
    rate: 8,
  },
  {
    id: "withholding-5",
    name: "Withholding Tax (5%)",
    rate: -5,
  },
  {
    id: "none",
    name: "No Tax",
    rate: 0,
  },
];

export const invoiceClients: InvoiceToDetails[] = [
  {
    id: "nairobi-county",
    name: "Nairobi County Government",
    email: "finance@nairobi.go.ke",
    addressLines: ["City Hall, P.O. Box 30075-00100", "Nairobi, Kenya"],
    taxId: "KRA-PIN-P051545789Z",
  },
  {
    id: "kisumu-county",
    name: "Kisumu County Government",
    email: "procurement@kisumu.go.ke",
    addressLines: ["P.O. Box 2738-40100", "Kisumu, Kenya"],
    taxId: "KRA-PIN-P051545790Z",
  },
  {
    id: "mombasa-county",
    name: "Mombasa County Government",
    email: "finance@mombasa.go.ke",
    addressLines: ["P.O. Box 90470-80100", "Mombasa, Kenya"],
    taxId: "KRA-PIN-P051545791Z",
  },
];

export function getLineAmount(item?: InvoiceLineItem) {
  if (!item) return 0;

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;

  return quantity * unitPrice;
}

export function getInvoiceItems(invoice: InvoiceFormValues) {
  return invoice.items;
}

export function getInvoiceSubtotal(invoice: InvoiceFormValues) {
  return getInvoiceItems(invoice).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getInvoiceTaxOption(invoice: InvoiceFormValues) {
  return invoiceTaxOptions.find((taxOption) => taxOption.id === invoice.taxId) ?? invoiceTaxOptions[0];
}

export function getInvoiceTax(invoice: InvoiceFormValues) {
  const taxRate = getInvoiceTaxOption(invoice).rate;

  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) * (taxRate / 100);
}

export function getInvoiceDiscount(invoice: InvoiceFormValues) {
  const subtotal = getInvoiceSubtotal(invoice);
  const discountValue = Number.isFinite(invoice.discountValue) ? invoice.discountValue : 0;
  const discount = invoice.discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;

  return Math.min(Math.max(discount, 0), subtotal);
}

export function getInvoiceTotal(invoice: InvoiceFormValues) {
  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) + getInvoiceTax(invoice);
}
