const searchInput = document.getElementById("searchInput")
const resultsContainer = document.getElementById("results")
const paginationContainer = document.getElementById("pagination")
let currentPage = 1
let totalPages = 1

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedSearch = debounce(() => {
  if (searchInput.value.length >= 5) {
    currentPage = 1
    search()
  } else {
    resultsContainer.innerHTML = ""
    paginationContainer.innerHTML = ""
  }
}, 300)

searchInput.addEventListener("input", debouncedSearch)

function search() {
  const query = searchInput.value.trim()
  if (query.length < 5) return

  fetch("/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `query=${encodeURIComponent(query)}&page=${currentPage}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Frontend client search response:", data)
      displayResults(data.questions)
      updatePagination(data.totalResults)
    })
    .catch((error) => {
      console.error("Error:", error)
      resultsContainer.innerHTML = '<li class="text-red-500">An error occurred while searching</li>'
    })
}

function displayResults(questions) {
  resultsContainer.innerHTML = questions
    .map(
      (q) => `
        <li class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div class="p-4 cursor-pointer flex justify-between items-center" onclick="toggleDetails(this)">
                <div>
                    <span class="font-semibold text-blue-600">${q.type || "Unknown"}</span>
                    <p class="mt-1">${DOMPurify.sanitize(q.title || "No title")}</p>
                </div>
                <svg class="w-6 h-6 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            <div class="question-details bg-gray-50 p-4 border-t">
                ${displayQuestionDetails(q)}
            </div>
        </li>
    `,
    )
    .join("")
}

function displayQuestionDetails(q) {
  switch (q.type) {
    case "ANAGRAM":
      return displayAnagramDetails(q)
    case "MCQ":
      return displayMCQDetails(q)
    case "READ_ALONG":
      return displayReadAlongDetails(q)
    default:
      return `<p>Details not available for this question type.</p>`
  }
}

function displayAnagramDetails(q) {
  return `
        <p class="font-semibold mb-2">Anagram Type: ${q.anagramType}</p>
        <div class="flex flex-wrap gap-2 mb-4">
            ${q.blocks
              .map(
                (block) => `
                <span class="px-2 py-1 bg-blue-100 rounded">${DOMPurify.sanitize(block.text)}</span>
            `,
              )
              .join("")}
        </div>
        <p class="font-semibold">Solution: <span class="text-green-600">${DOMPurify.sanitize(q.solution || "Not specified")}</span></p>
    `
}

function displayMCQDetails(q) {
  return `
        <p class="font-semibold mb-2">Options:</p>
        <ul class="list-disc pl-5 mb-2">
            ${q.options
              .map(
                (option) => `
                <li class="${option.isCorrectAnswer ? "text-green-600 font-semibold" : ""}">${DOMPurify.sanitize(option.text)}</li>
            `,
              )
              .join("")}
        </ul>
    `
}

function displayReadAlongDetails(q) {
  return `
        <p class="font-semibold mb-2">Read Along Text:</p>
        <p>${DOMPurify.sanitize(q.title)}</p>
    `
}

function toggleDetails(element) {
  const details = element.nextElementSibling
  const arrow = element.querySelector("svg")
  details.classList.toggle("show")
  arrow.classList.toggle("rotate-180")
}

function updatePagination(totalResults) {
  totalPages = Math.ceil(totalResults / 10)
  paginationContainer.innerHTML = ""

  if (currentPage > 1) {
    addPaginationButton("Previous", currentPage - 1)
  }

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    addPaginationButton(i, i, i === currentPage)
  }

  if (currentPage < totalPages) {
    addPaginationButton("Next", currentPage + 1)
  }
}

function addPaginationButton(text, page, isActive = false) {
  const button = document.createElement("button")
  button.textContent = text
  button.classList.add("px-4", "py-2", "rounded", "focus:outline-none")
  if (isActive) {
    button.classList.add("bg-blue-500", "text-white")
  } else {
    button.classList.add("bg-white", "text-blue-500", "hover:bg-blue-100")
  }
  button.addEventListener("click", () => {
    currentPage = page
    search()
  })
  paginationContainer.appendChild(button)
}

