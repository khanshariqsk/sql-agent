# SQL Genie 💬🧞‍♂️

An **AI-powered SQL Assistant** that lets you query your database using **natural language**.  
Built with **Next.js**, **AI SDK**, and **Google Gemini**, this project streams intelligent SQL responses directly into a modern chat interface.

---

## 🚀 Features

- 💬 Real-time AI chat interface powered by `@ai-sdk/react`
- 🧠 Uses **Google Gemini 2.5 Flash** for text generation
- 🛠️ Integrated with SQLite for testing and schema interactions
- 🧾 Tool-based reasoning (schema & db tools)
- ⚡ Streams AI responses directly to the UI
- 🪄 Auto-scroll, markdown rendering, and loading states

---

## 🧩 Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | React (Next.js)                |
| Styling  | Tailwind CSS                   |
| AI SDK   | @ai-sdk/react + @ai-sdk/google |
| Backend  | Next.js API Routes             |
| Database | SQLite (via custom db handler) |
| Language | TypeScript                     |

---

## 🧠 How It Works

### 1. **User Input**

Users send natural language queries through the chat UI.

### 2. **AI Processing**

The backend (`/api/chat/route.ts`) uses the **AI SDK** to send messages to the Gemini model with a system prompt.  
It also defines **two tools**:

- **schema tool** → provides SQL schema info.
- **db tool** → executes SELECT queries safely.

### 3. **Streaming Responses**

The `streamText()` function streams token-by-token AI responses to the frontend.

---

## 🧱 Project Structure

```
📦 sql-genie
├── 📁 app
│   ├── 📄 page.tsx              # Main chat page (Chat UI)
│   └── 📁 api/chat/route.ts     # AI backend logic
├── 📁 db
│   └── 📄 db.ts                 # SQLite database connection
├── 📄 package.json
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
└── 📄 README.md
```

---

## 🧰 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/khanshariqsk/sql-agent.git
cd sql-agent
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup environment variables

Create a `.env` file in the root directory and add:

```bash
GOOGLE_API_KEY=your_gemini_api_key
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧠 Example Interaction

**User:** "Show me the top 5 most sold products this month."  
**AI:**

```sql
SELECT name, SUM(quantity) AS total_sold
FROM sales
JOIN products ON sales.product_id = products.id
WHERE strftime('%m', sale_date) = strftime('%m', 'now')
GROUP BY name
ORDER BY total_sold DESC
LIMIT 5;
```

---

## ⚙️ Customization

You can modify:

- The **schema** in `route.ts` → add or change database tables.
- The **system prompt** → control how the assistant behaves.
- The **UI theme** → adjust Tailwind classes in `Chat.tsx`.

---

## 🧑‍💻 Author

**Shariq Khan**  
Built with ❤️ using **Next.js + AI SDK + Gemini**

---

> “SQL Genie — Your wish is my query.” 🧞‍♂️
