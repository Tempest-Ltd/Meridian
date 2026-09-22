import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

export function OrderConfirmation({
  orderNumber,
  customerName,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Meridian order #{orderNumber} is confirmed.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>
            MERIDIAN<span style={{ color: "#c9a227" }}>.</span>
          </Heading>

          <Heading style={h1}>
            Order confirmed, {customerName.split(" ")[0]}.
          </Heading>
          <Text style={lead}>
            Thanks for your order. We&apos;ll let you know the moment it ships.
          </Text>

          <Section style={orderBox}>
            <Text style={orderLabel}>Order Number</Text>
            <Text style={orderNumber_}>#{orderNumber}</Text>
          </Section>

          <Hr style={hr} />

          {items.map((item, i) => (
            <Section key={i} style={itemRow}>
              <Img src={item.image} width="56" height="56" style={itemImage} />
              <div style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemMeta}>Qty {item.quantity}</Text>
              </div>
              <Text style={itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </Section>
          ))}

          <Hr style={hr} />

          <Section>
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            />
            <Hr style={hr} />
            <Row label="Total" value={`$${total.toFixed(2)}`} bold />
          </Section>

          <Hr style={hr} />

          <Text style={sectionLabel}>Shipping to</Text>
          <Text style={address}>{shippingAddress}</Text>

          <Text style={footer}>
            Questions? Reply to this email or contact support@meridian.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div style={row}>
      <Text style={bold ? rowLabelBold : rowLabel}>{label}</Text>
      <Text style={bold ? rowValueBold : rowValue}>{value}</Text>
    </div>
  );
}

const main = {
  backgroundColor: "#fbfaf7",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
};
const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "520px",
};
const brand = {
  fontSize: "16px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  color: "#1b2e24",
  margin: "0 0 32px",
};
const h1 = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#0a0a0a",
  margin: "0 0 8px",
  letterSpacing: "-0.01em",
};
const lead = {
  fontSize: "14px",
  color: "#6b6b6b",
  margin: "0 0 32px",
};
const orderBox = {
  backgroundColor: "#f5f3ef",
  borderRadius: "8px",
  padding: "16px 20px",
  marginBottom: "24px",
};
const orderLabel = {
  fontSize: "10px",
  color: "#6b6b6b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 4px",
};
const orderNumber_ = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#0a0a0a",
  margin: 0,
  fontFamily: "monospace",
};
const hr = { borderColor: "#e7e5e4", margin: "20px 0" };
const itemRow = { display: "flex" as const, alignItems: "center" as const, padding: "8px 0" };
const itemImage = { borderRadius: "6px", objectFit: "cover" as const };
const itemName = { fontSize: "13px", color: "#0a0a0a", margin: 0 };
const itemMeta = { fontSize: "11px", color: "#6b6b6b", margin: "2px 0 0" };
const itemPrice = { fontSize: "13px", fontWeight: 600, color: "#0a0a0a", margin: 0 };
const row = { display: "flex" as const, justifyContent: "space-between" as const };
const rowLabel = { fontSize: "13px", color: "#6b6b6b", margin: "4px 0" };
const rowLabelBold = { fontSize: "14px", fontWeight: 600, color: "#0a0a0a", margin: "4px 0" };
const rowValue = { fontSize: "13px", color: "#0a0a0a", margin: "4px 0" };
const rowValueBold = { fontSize: "14px", fontWeight: 600, color: "#0a0a0a", margin: "4px 0" };
const sectionLabel = {
  fontSize: "10px",
  color: "#6b6b6b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 6px",
};
const address = { fontSize: "13px", color: "#0a0a0a", margin: 0, whiteSpace: "pre-line" as const };
const footer = { fontSize: "12px", color: "#6b6b6b", margin: "32px 0 0" };