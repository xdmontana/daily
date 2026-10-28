
// ONE QUESTION A DAY

async function loadQuestion() {

    try {

        // Load all questions
        const response = await fetch("questions.json");

        if (!response.ok) {
            throw new Error("Could not load questions");
        }

        const questions = await response.json();

        // Get today's date (UTC)
        const today = new Date();

        const todayString = "2026-11-05";

        // Display today's date
        document.getElementById("today-date").textContent =
            today.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC"
            });

        // Find today's question
        const todaysQuestion = questions.find(
            question => question.publishDate === todayString
        );

        // Display previous questions
        displayArchive(questions, todayString);

        const exploreButton =
            document.getElementById("explore-btn");

        // No question scheduled
        if (!todaysQuestion) {

            document.getElementById("question").textContent =
                "No question scheduled for today.";

            document.getElementById("category").textContent = "";
            document.getElementById("type").textContent = "";

            exploreButton.hidden = true;

            return;
        }

        // Display today's question
        document.getElementById("question").textContent =
            todaysQuestion.text;

        document.getElementById("category").textContent =
            todaysQuestion.category;

        document.getElementById("type").textContent =
            todaysQuestion.type;

        // Display explanation information
        document.getElementById("source").textContent =
            todaysQuestion.source;

        document.getElementById("context").textContent =
            todaysQuestion.context;

        document.getElementById("followUp").textContent =
            todaysQuestion.followUp;

        // Explore button
        const explanation =
            document.getElementById("explanation");

        exploreButton.addEventListener("click", function() {

            explanation.hidden = !explanation.hidden;

            const isOpen = !explanation.hidden;

            exploreButton.textContent = isOpen
                ? "Close explanation"
                : "Explore the idea";

            exploreButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    } catch (error) {

        console.error(error);

        document.getElementById("question").textContent =
            "Unable to load today's question.";

        document.getElementById("explore-btn").hidden = true;

    }

}


// QUESTION ARCHIVE

function displayArchive(questions, todayString) {

    const archiveList =
        document.getElementById("archive-list");

    archiveList.replaceChildren();

    // Only questions before today
    const previousQuestions = questions.filter(
        question => question.publishDate < todayString
    );

    // Newest first
    previousQuestions.sort(
        (a, b) => b.publishDate.localeCompare(a.publishDate)
    );

    // Empty archive
    if (previousQuestions.length === 0) {

        archiveList.textContent =
            "No previous questions yet. Come back tomorrow!";

        return;
    }

    // Create a card for each question
    previousQuestions.forEach(function(question) {

        const card = document.createElement("article");
        card.className = "archive-card";

        // Date
        const date = document.createElement("p");
        date.className = "archive-date";

        date.textContent = new Date(
            question.publishDate + "T00:00:00Z"
        ).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC"
        });

        // Category
        const category = document.createElement("p");
        category.className = "archive-category";
        category.textContent = question.category;

        // Question
        const title = document.createElement("h3");
        title.textContent = question.text;

        // Explore button
        const button = document.createElement("button");
        button.className = "archive-button";
        button.type = "button";
        button.textContent = "Explore the idea";
        button.setAttribute("aria-expanded", "false");

        // Explanation
        const explanation = document.createElement("div");
        explanation.className = "archive-explanation";
        explanation.hidden = true;

        const source = document.createElement("p");
        source.textContent = "Source: " + question.source;

        const context = document.createElement("p");
        context.textContent = question.context;

        const followUp = document.createElement("p");
        followUp.textContent =
            "A second thought: " + question.followUp;

        explanation.append(source, context, followUp);

        // Button interaction
        button.addEventListener("click", function() {

            explanation.hidden = !explanation.hidden;

            const isOpen = !explanation.hidden;

            button.textContent = isOpen
                ? "Close explanation"
                : "Explore the idea";

            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        // Add elements to card
        card.append(
            date,
            category,
            title,
            button,
            explanation
        );

        // Add card to archive
        archiveList.appendChild(card);

    });

}


// START WEBSITE

loadQuestion();
