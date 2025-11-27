//TODO: 

// Add response status, add headers and so on to the fetch-api!

// DESIRED OUTPUT: 

/* 
    Output:
    - Pushed 3 commits to kamranahmedse/developer-roadmap
    - Opened a new issue in kamranahmedse/developer-roadmap
    - Starred kamran 
    ....and so on
*/

// ALLOW PROMPT FOR DIFFERENT PARAMS! 

// =>> What indicates the most recent activity?

// IMPORTANT: Change timestamp to human readable!! 

// ALLOW EXIT, SEARCH PARAMS AFTER ANY RETURNED ANSWER! 


/// ABSOLUTES SAHNESTÜCK: 

// iteriere durch die objects und suche jeden commit, nach und nach!!, dann zuordnen 

// promise-chaining. oder caching, so dass es überschrieben werden kann. 


// FÜR DIE FORMATIERUNG DER ANTWORT! 

/* const parseResult  = (result) => {
    commits.length; + repo.url,
    stars.length + repo.url,
    issues.length + repo.url,
}; */

const userCache = new Set();

const getRepoUrls = (resultObject) => {
    if (!resultObject) {
        return "probably out of limit!";
    }
    const uniqueUrls = [];
    for (let item in resultObject) {
        let url = resultObject[item].repo?.url;
        if (!uniqueUrls.includes(url)) {
            uniqueUrls.push(url);
        }
    }
    return uniqueUrls;
};

const checkUser = (user) => {
    if (userCache.has(user)) {
        console.log(`${user} is in cache`);
    } else {
        userCache.add(user);
    }
    return userCache.entries(user);
}

const getLatestCommits = async (url) => {
    try {
        const response = await fetch(`${url}/commits`);
        if (!response.ok) {
           console.error(`GitHub API error: ${response.status}`);
        }
        const commitList = await response.json();

        if (commitList) {
            return commitList.map(({ commit, author }) => ({
                message: commit.message,
                author: author.name,
                date: commit.committer.date,
                url: commit.url,
            }));
        }
        return "nothing found";
    } catch (e) {
        console.error("ErRoRRR, ", e);
    }
}

const getEvents = (events) => {

    if (events.length > 0) {
        return events.map((event) =>  ({
            type: event.type,
            repo: event.repo,
            createdAt: event.created_at
        }));
    }
    return "No recent evnts from this user!";
};

const getUserStats = async (user) => {

        const checkedUser = checkUser(user);

        const response = await fetch(`https://api.github.com/users/${user}/events`);

        if (!response.ok) {
            console.error(`GitHub API error. Response status ${response.status}. ${response.statusText}`);

            return;
         }

        const result = await response.json();
    
        const latestEvents = getEvents(result);
        
        const repoUrls = getRepoUrls(result);

        if (repoUrls.length === 0) {
            process.stdout.write("No recent repo urls for this user \n");
        return;
        }

        const commits = await Promise.all(
            repoUrls.map(url => getLatestCommits(url))
        );

        console.log(commits);

};

const startApp = () => {
    process.stdin.on("data", async (data) => {
        process.stdin.setEncoding("utf-8");
        if (data.length > 0) {
            const info = await getUserStats(data);
        }
    });
};

startApp();