module.exports = async () => {
    const fetch = (await import('node-fetch')).default;

    const url = `https://api.github.com/repos/Fabien83560/CounterPro/commits`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'node-fetch'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API returned an error: ${response.statusText}`);
        }

        const commits = await response.json();
        const lastCommit = commits[0];
        return lastCommit;
    } catch (error) {
        console.error("Failed to fetch the last commit:", error.message);
    }
}
