//TODO: 

// Add response status, add headers and so on to the fetch-api!

// ALLOW PROMPT FOR DIFFERENT PARAMS! 

// =>> What indicates the most recent activity?

// ALLOW EXIT, SEARCH PARAMS AFTER ANY RETURNED ANSWER! 

const getUser = async (user) => {
    try {
        const response = await fetch(`https://api.github.com/users/${user}/following`);
        const result = await response.json();
        console.log(result);
        // wenn object key nur ein result ist. 
        const processed = result.map(item => {
            return {"createdAt": item.created_at, "repository": item.repo }
        });
        return processed;
    }
        catch (e) {
        process.stdout.write("there's an error", e);
    }
};

// "help" function einbauen! 

const startApp = () => {
    process.stdin.on("data", (data) => {
        process.stdin.setEncoding("utf-8");
        if (data.length > 0) {
            // in eine Promise packen!
            // add flags! for better search!! 
            getUser(data);
        //process.stdout.write(RESULT);
        }
    });
}

startApp();