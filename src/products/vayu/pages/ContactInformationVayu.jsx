import React from "react";

export default function ContactInformationVayu() {
  return (
            <main style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 20px)' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 'bold', marginBottom: 'clamp(32px, 8vw, 48px)', color: '#000000' }}>Contact information</h1>

        <div>
          <section style={{ marginBottom: '32px' }}>
            <div style={{ lineHeight: '1.8' }}>
                      <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
                <strong style={{ fontWeight: '600' }}>Trade name:</strong> Vayu X
              </div>
                      <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
                <strong style={{ fontWeight: '600' }}>Phone number:</strong> +91-902-2792-824
              </div>
                      <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
                <strong style={{ fontWeight: '600' }}>Email:</strong> <a href="mailto:contact@byoncocare.com" style={{ color: '#0066cc', textDecoration: 'underline' }}>contact@byoncocare.com</a>
              </div>
                      <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
                <strong style={{ fontWeight: '600' }}>Physical address:</strong> ITI Layout, Somasundarapalya, Bengaluru, Karnataka, India 560102
              </div>
                      <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
                <strong style={{ fontWeight: '600' }}>GST number:</strong> Coming soon
              </div>
                      <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
                <strong style={{ fontWeight: '600' }}>Company registration number (CIN):</strong> U62011PN2025PTC237186
              </div>
            </div>
          </section>

          <section style={{ paddingTop: '32px', borderTop: '1px solid #e5e5e5' }}>
                    <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: '600', marginBottom: 'clamp(12px, 3vw, 16px)', color: '#000000' }}>Questions or Concerns?</h2>
                    <p style={{ lineHeight: '1.6', fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#000000' }}>
              For any questions, concerns, or support requests, please contact us using the information above.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

