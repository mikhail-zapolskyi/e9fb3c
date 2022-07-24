import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { SidebarContainer } from "../components/Sidebar";
import { ActiveChat } from "../components/ActiveChat";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post("/api/messages", body);
    return data;
  };

  const postMessage = (body) => {
    try {
      const data = saveMessage(body);

      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewConvo = useCallback(
    (recipientId, message) => {
      conversations.forEach((convo) => {
        if (convo.otherUser.id === recipientId) {
          convo.messages.push(message);
          convo.latestMessageText = message.text;
          convo.id = message.conversationId;
        }
      });
      setConversations(conversations);
    },
    [setConversations, conversations]
  );

  const addMessageToConversation = useCallback(
    (data) => {
      // if sender isn't null, that means the message needs to be put in a brand new convo
      const { message, sender = null } = data;
      if (sender !== null) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
        };
        newConvo.latestMessageText = message.text;
        setConversations((prev) => [newConvo, ...prev]);
      }

      conversations.forEach((convo) => {
        if (convo.id === message.conversationId) {
          convo.messages.push(message);
          convo.latestMessageText = message.text;
        }
      });
      setConversations(conversations);
    },
    [setConversations, conversations]
  );

  const setActiveChat = (username) => {
    setActiveConversation(username);
  };

  // Lifecycle

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push("/login");
      else history.push("/register");
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get("/api/conversations");
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
        />
      </Grid>
    </>
  );
};

export default Home;
