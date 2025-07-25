export function createSecurityPage() {
    const app = document.getElementById('app');

    const securityContent = `Contact: mailto:tristandereigne@gmail.com
Expires: 2027-03-06T11:00:00.000Z
Preferred-Languages: fr,en`;

    app.innerHTML = `
        <div class="bg-black text-white min-h-screen p-5 font-mono">
            <pre class="text-sm leading-relaxed">${securityContent}</pre>
        </div>
    `;

    document.title = 'security.txt';
}