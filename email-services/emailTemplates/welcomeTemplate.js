function welcomeTemplate(name, role) {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome, ${name}!</h2>
        <p>You have successfully created your account.</p>
        <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
        <p>Thank you for joining us.</p>
      </div>
    `;
  }
  
  module.exports = welcomeTemplate;
  