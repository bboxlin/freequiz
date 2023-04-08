async function fetchAllCommits(owner, repo) {
    let commits = [];
    let page = 1;
    const perPage = 100;
    while (true) {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();

                if (data.length === 0) {
                    break; // No more commits
                }

                commits = commits.concat(data);
                page++;
            } else {
                console.error('Error fetching commit data:', response.status, response.statusText);
                break;
            }
        } catch (error) {
            console.error('Error:', error);
            break;
        }
    }
    return commits;
}

function displayCommitMessages(commits) {
    msgbox = $("#msgbox")
    msgbox.find('div').remove()
    commits.forEach(commit => {
        const msg = `
            <div class="media text-muted pt-3">
                <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <strong class="d-block text-gray-dark">@${commit.author.login}</strong>
                    ${commit.commit.committer.date} ${commit.commit.message}
                </p>
            </div>
        `
        msgbox.append(msg)
    })
}

 