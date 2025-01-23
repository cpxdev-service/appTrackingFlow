import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chat = () => {
  const [chats, setChats] = React.useState(null);
  const [msg, setMsg] = React.useState("");

  const createChat = (keyman) => {
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: keyman,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          localStorage.setItem("chatid", result.genid);
          setChats([]);
        } else {
          alert(result.message);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const sendmessage = () => {
    if (msg === "") {
      return;
    }
    const chatx = chats;
    setChats(null);
    fetch("/api/chat/send/" + localStorage.getItem("chatid"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "user",
        content: msg,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setMsg("");
        if (result.status) {
          if (result.res.length > 0) {
            setChats(result.res);
            setTimeout(() => {
              const element = document.getElementById(
                "scroll-" + (result.res.length - 1)
              );
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }, 100);
          }
        } else {
          alert("error");
          setChats(chatx);
        }
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    let text = "";
    setTimeout(() => {
      if (localStorage.getItem("chatid") !== null) {
        fetch("/api/chat/" + localStorage.getItem("chatid"), {})
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              if (result.res.length === 0) {
                const person = prompt(
                  "How would you like the AI ​​to answer your questions?"
                );
                if (person == null || person == "") {
                  text = "";
                } else {
                  text = person;
                }
                createChat(text);
              } else {
                setChats(result.res);
                setTimeout(() => {
                  const element = document.getElementById(
                    "scroll-" + (result.res.length - 1)
                  );
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }
            } else {
              alert("error");
            }
          })
          .catch((error) => console.log("error", error));
      } else {
        const person = prompt(
          "How would you like the AI ​​to answer your questions?"
        );
        if (person == null || person == "") {
          text = "";
        } else {
          text = person;
        }
        createChat(text);
      }
    }, 1000);
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">AI Chat</h3>
        <p className="card-text">
          Notes: Chat History will be in-memory cache on server. If server is
          sleep or update. All chat history will be clear itself.
        </p>
        <hr />
        {chats !== null ? (
          <>
            {chats.map(
              (item, i) =>
                item.role !== "system" && (
                  <div className="card mb-2" id={"scroll-" + i}>
                    {item.role == "assistant" ? (
                      <div>
                        <p
                          className="text-decoration-underline"
                          style={{ fontSize: 20 }}>
                          Assistant
                        </p>{" "}
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {item.content}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="text-end">
                        <p
                          className="text-decoration-underline"
                          style={{ fontSize: 20 }}>
                          You
                        </p>{" "}
                        {item.content}
                      </div>
                    )}
                  </div>
                )
            )}
            <hr />
            <div className="mb-3 mt-3">
              <label for="exampleFormControlInput1" className="form-label">
                Enter message
              </label>
              <textarea
                className="form-control"
                rows="2"
                autoComplete="off"
                onChange={(e) => setMsg(e.target.value)}></textarea>
            </div>
            <button
              onClick={() => sendmessage()}
              className="btn btn-primary m-1">
              Send Message
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("chatid");
                window.location.reload();
              }}
              className="btn btn-info m-1">
              Reset Session
            </button>
          </>
        ) : (
          <div className="skeleton-loader">
            <div className="skeleton text"></div>
            <div className="skeleton text"></div>
            <div className="skeleton text"></div>
            <div className="skeleton text"></div>
            <div className="skeleton text"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
