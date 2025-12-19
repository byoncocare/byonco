import React from "react";

export default function WarrantyVayu() {
  return (
    <main style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 20px)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>Warranty policy</h1>
        <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#666666', marginBottom: 'clamp(32px, 8vw, 48px)' }}>Last updated: July 7, 2025</p>

        <div>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: '600', marginBottom: 'clamp(12px, 3vw, 16px)', color: '#000000' }}>Coverage</h2>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', lineHeight: '1.8', color: '#000000' }}>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>
                <strong style={{ fontWeight: '600' }}>12-month limited warranty</strong> on Vayu X device and charging kit.
              </li>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Manufacturing defects and functional failures under normal use.</li>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Firmware/software updates provided during the warranty term.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: '600', marginBottom: 'clamp(12px, 3vw, 16px)', color: '#000000' }}>Exclusions</h2>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', lineHeight: '1.8', color: '#000000' }}>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Accidental damage, liquid damage, cosmetic wear, or misuse.</li>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Third-party repairs, unauthorized modifications, or rooting/jailbreaking.</li>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Consumables (nose pads, frames) beyond manufacturing defects.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: '600', marginBottom: 'clamp(12px, 3vw, 16px)', color: '#000000' }}>How to Claim</h2>
            <ol style={{ listStyle: 'decimal', paddingLeft: '24px', lineHeight: '1.8', color: '#000000' }}>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>
                Write to <a href="mailto:contact@byoncocare.com" style={{ color: '#0066cc', textDecoration: 'underline' }}>contact@byoncocare.com</a> with order ID and issue.
              </li>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>We'll run remote diagnostics and arrange pickup if required.</li>
              <li style={{ marginBottom: '8px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Repair or replacement will be provided per assessment.</li>
            </ol>
          </section>

          <section style={{ marginBottom: '32px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6' }}>
              <strong style={{ fontWeight: '600', color: '#000000' }}>Note:</strong> This policy aligns with Indian consumer protection norms. For commercial/enterprise deployments, additional SLA terms may apply.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
