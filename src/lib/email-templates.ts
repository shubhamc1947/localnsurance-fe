/**
 * Localsurance branded email templates.
 * Uses table-based layout and inline CSS for maximum email client compatibility.
 */

const BRAND = {
  primaryBlue: "#0066FF",
  accentOrange: "#F97316",
  darkText: "#2A3F5F",
  lightGrayBg: "#F8FAFC",
  white: "#FFFFFF",
  mutedText: "#64748B",
  borderColor: "#E2E8F0",
};

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Localsurance</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.lightGrayBg};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lightGrayBg};padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;border:1px solid ${BRAND.borderColor};box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:32px 40px 16px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:28px;font-weight:bold;letter-spacing:-0.5px;">
                    <span style="color:#EF4444;">&#128205;</span><span style="color:${BRAND.primaryBlue};">Local</span><span style="color:${BRAND.darkText};">surance</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px 40px;border-top:1px solid ${BRAND.borderColor};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="font-size:13px;color:${BRAND.mutedText};line-height:20px;">
                    If you didn&rsquo;t request this email, you can safely ignore it.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:${BRAND.mutedText};padding-top:12px;">
                    &copy; ${new Date().getFullYear()} Localsurance. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/**
 * OTP Verification Email Template
 */
export function getOtpEmailTemplate(
  otpCode: string,
  recipientName?: string
): string {
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";
  const digits = otpCode.split("");

  const otpBoxes = digits
    .map(
      (digit) =>
        `<td align="center" style="width:48px;height:56px;background-color:${BRAND.primaryBlue};color:${BRAND.white};font-size:28px;font-weight:bold;border-radius:8px;letter-spacing:1px;font-family:'Courier New',monospace;">${digit}</td>`
    )
    .join(`<td style="width:8px;"></td>`);

  const content = `
          <tr>
            <td align="center" style="padding:8px 40px 0 40px;">
              <h1 style="margin:0;font-size:24px;font-weight:bold;color:${BRAND.darkText};">Verify Your Email</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:12px 40px 0 40px;">
              <p style="margin:0;font-size:16px;color:${BRAND.mutedText};line-height:24px;">
                ${greeting} here&rsquo;s your verification code:
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  ${otpBoxes}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 8px 40px;">
              <p style="margin:0;font-size:14px;color:${BRAND.mutedText};line-height:22px;">
                This code expires in <strong style="color:${BRAND.darkText};">10 minutes</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 28px 40px;">
              <p style="margin:0;font-size:13px;color:${BRAND.mutedText};line-height:20px;">
                Enter this code on the verification page to complete your sign-up.
              </p>
            </td>
          </tr>`;

  return baseLayout(content);
}

/**
 * Employee Onboarding Invitation Email Template
 */
export function getEmployeeInviteTemplate(params: {
  employeeName: string;
  companyName: string;
  adminName: string;
  onboardingUrl: string;
  personalizedMessage?: string;
}): string {
  const {
    employeeName,
    companyName,
    adminName,
    onboardingUrl,
    personalizedMessage,
  } = params;

  const personalizedBlock = personalizedMessage
    ? `
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lightGrayBg};border-left:4px solid ${BRAND.accentOrange};border-radius:0 8px 8px 0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:bold;color:${BRAND.mutedText};text-transform:uppercase;letter-spacing:0.5px;">Message from ${adminName}</p>
                    <p style="margin:0;font-size:14px;color:${BRAND.darkText};line-height:22px;font-style:italic;">
                      &ldquo;${personalizedMessage}&rdquo;
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  const content = `
          <tr>
            <td align="center" style="padding:8px 40px 0 40px;">
              <h1 style="margin:0;font-size:22px;font-weight:bold;color:${BRAND.darkText};line-height:30px;">
                You&rsquo;re Invited to Join<br />${companyName}&rsquo;s Health Plan!
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 40px 24px 40px;">
              <p style="margin:0;font-size:16px;color:${BRAND.mutedText};line-height:24px;">
                Hi ${employeeName}, <strong style="color:${BRAND.darkText};">${adminName}</strong> has invited you to join the company health insurance plan through Localsurance.
              </p>
            </td>
          </tr>
          ${personalizedBlock}
          <tr>
            <td align="center" style="padding:0 40px 28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:${BRAND.accentOrange};border-radius:8px;">
                    <a href="${onboardingUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:${BRAND.white};font-size:16px;font-weight:bold;text-decoration:none;letter-spacing:0.3px;">
                      Complete Your Onboarding
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lightGrayBg};border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px 0;font-size:14px;font-weight:bold;color:${BRAND.darkText};">What you&rsquo;ll need to provide:</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:${BRAND.mutedText};line-height:22px;">
                          &#8226;&nbsp;&nbsp;Personal information (name, DOB, nationality)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:${BRAND.mutedText};line-height:22px;">
                          &#8226;&nbsp;&nbsp;Contact details
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:${BRAND.mutedText};line-height:22px;">
                          &#8226;&nbsp;&nbsp;Spouse details (optional)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:${BRAND.mutedText};line-height:22px;">
                          &#8226;&nbsp;&nbsp;Dependant details (optional)
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 28px 40px;">
              <p style="margin:0;font-size:13px;color:${BRAND.mutedText};line-height:20px;">
                This link is unique to you and expires in <strong style="color:${BRAND.darkText};">7 days</strong>.
              </p>
            </td>
          </tr>`;

  return baseLayout(content);
}
