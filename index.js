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

// ganz zum schluss: als docker image releasen! 

// Man benötigt quasi ein DTO! 

const getUser = async (user) => {
        const response = await fetch(`https://api.github.com/users/${user}/events`);
        const result = await response.json();
        // wenn object key nur ein result ist. 
        const processed = result.map(item => {
            return {"createdAt": item.created_at, "repository": item.repo }
        });
        return processed;
};

// "help" function einbauen! 

const startApp = () => {
    process.stdin.on("data", async (data) => {
        process.stdin.setEncoding("utf-8");
        if (data.length > 0) {
            // add flags! for better search!! 
            const info = await getUser(data);
            console.log(info, " INFO?");
        }
    });
};

startApp();