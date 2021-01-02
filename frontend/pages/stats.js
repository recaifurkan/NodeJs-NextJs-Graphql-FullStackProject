import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import client from "./api/graph";
import { ApolloProvider, useQuery, gql, useSubscription } from "@apollo/client";

const ALL_EVENTS = gql`
  query events {
    events {
      id
      leadId
      name
      value
    }
  }
`;

const EVENT_SUBSCRIPTION = gql`
  subscription eventUpdated {
    eventUpdated {
      id
      leadId
      name
      value
    }
  }
`;

function LatestComment() {
  const { data, loading } = useSubscription(EVENT_SUBSCRIPTION);
  console.log("subs");

  if (loading) return <p>Loading...</p>;
  if (!data || !data.eventUpdated) return <p>Not Loaded...</p>;
  console.log(data);
  let event = data.eventUpdated;
  return (
    <h4>
      New Event : {event.leadId} - {event.name} - {event.value}
    </h4>
  );
}

function AllEvents() {
  const { loading, error, data } = useQuery(ALL_EVENTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.events.map((event) => (
    <div>
      {event.leadId} - {event.name} - {event.value}
    </div>
  ));
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div className={styles.container}>
        <Head>
          <title>Stats</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AllEvents></AllEvents>
        <LatestComment></LatestComment>

        <main className={styles.main}></main>

        <footer className={styles.footer}></footer>
      </div>
    </ApolloProvider>
  );
}
