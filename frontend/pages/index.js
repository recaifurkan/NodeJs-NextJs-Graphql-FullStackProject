import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import client from "./api/graph";
import { ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

var mongoObjectId = function () {
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

const EVENT = gql`
  query event($leadId: String!) {
    event(leadId: $leadId) {
      id
      leadId
      name
      value
    }
  }
`;

const CREATE_EVENT = gql`
  mutation createEvent($leadId: String!, $name: String!, $value: Int!) {
    createEvent(input: { leadId: $leadId, name: $name, value: $value }) {
      id
    }
  }
`;

let executed = false;
function CreateEvent({ leadId }) {
  const [createEvent] = useMutation(CREATE_EVENT);
  if (!executed) {
    createEvent({
      variables: { leadId, name: "welcome", value: 1 },
    });
    executed = true;
  }
  return <div>Create Event</div>;
}
function Event({ leadId }) {
  const { loading, error, data } = useQuery(EVENT, {
    variables: {
      leadId,
    },
  });

  // const [updateEvent] = useMutation(UPDATE_EVENT);
  // updateEvent({ variables: { leadId , name: "welcome", value: 1 } });
  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let event = data.event;

  return (
    <div>
      {event.leadId} - {event.name} - {event.value}
    </div>
  );
}

export default function Home() {
  const ssrMode = !process.browser;
  let leadId = null;

  if (!ssrMode) {
    leadId = window.localStorage.getItem("leadId");
    if (!leadId) {
      leadId = mongoObjectId();
      window.localStorage.setItem("leadId", leadId);
    }
  }

  return (
    <ApolloProvider client={client}>
      <div className={styles.container}>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <CreateEvent leadId={leadId}></CreateEvent>
        <Event leadId={leadId}></Event>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Lead Id <a href="#">{leadId}</a>
          </h1>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </ApolloProvider>
  );
}
