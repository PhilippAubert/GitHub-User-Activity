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

const getEvents = (events) => {
    if (!events.length) {
        return "No recent events from this user!";
    }
  
    return events.map(event => ({
        type: event.type,
        repo: event.repo?.name,
        createdAt: event.created_at,
        payload: {
            ref: event.payload?.ref,
            refType: event.payload?.ref_type,
            commits: event.payload?.commits,
            size: event.payload?.size,
            action: event.payload?.action,
            issue: event.payload?.issue ? { title: event.payload.issue.title } : null
        }
    }));
};
  

const parseEvents = (latestEvents) => {

    if (!Array.isArray(latestEvents)) return latestEvents;

    const pushMap = new Map();
    const otherEvents = [];

    latestEvents.forEach(event => {
        const { type, repo, payload } = event;
        const branch = payload.ref?.replace("refs/heads/", "") || "main";

        if (type === "PushEvent") {
            const commitCount = payload.size ?? payload.commits?.length ?? 1;
            const key = `${repo}::${branch}`;

            if (pushMap.has(key)) {
                pushMap.set(key, pushMap.get(key) + commitCount);
            } else {
                pushMap.set(key, commitCount);
            }
        } else {
            switch (type) {
                case "CreateEvent":
                    if (payload.refType === "branch") {
                        otherEvents.push(`Created new branch: "${payload.ref}" in ${repo}`);
                    } else if (payload.refType === "tag") {
                        otherEvents.push(`Created a new tag ${payload.ref} in ${repo}`);
                    } else if (payload.refType === "repository") {
                        otherEvents.push(`Created the repository ${repo}`);
                    }
                    break;

                case "IssuesEvent":
                    otherEvents.push(`${capitalize(payload.action)} an issue in ${repo}: ${payload.issue?.title || "no title"}`);
                    break;

                case "WatchEvent":
                    otherEvents.push(`Starred ${repo}`);
                    break;

                default:
                    otherEvents.push(`Performed ${type} in ${repo}`);
            }
        }
    });

    const pushEvents = Array.from(pushMap.entries()).map(([key, totalCommits]) => {
        const [repo, branch] = key.split("::");
        const commitText = totalCommits === 1 ? "1 commit" : `${totalCommits} commits`;
        return `Pushed ${commitText} to ${repo} (${branch})`;
    });

    return [...pushEvents, ...otherEvents];
};

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getUserStats = async (user) => {

    const response = await fetch(`https://api.github.com/users/${user}/events`);

    if (!response.ok) {
        console.error(`GitHub API error. Response status ${response.status}. ${response.statusText}`);
        return;
    }

    const result = await response.json();
    
    const latestEvents = getEvents(result);

    return latestEvents;
};

const startApp = () => {
    process.stdin.on("data", async (data) => {
        process.stdin.setEncoding("utf-8");
        const input = data.toString().toLowerCase().trim();
        if (input.length > 0) {
            if (input === "exit") {
                process.stdout.write("see you next time!\n");
                process.exit();
            } else {
                const userInfo = await getUserStats(input);
                const parsedUserInfo = parseEvents(userInfo);
                parsedUserInfo.forEach(line => process.stdout.write(line + '\n'));
            }
        }
    });
};

startApp();