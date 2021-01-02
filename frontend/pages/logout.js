import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import client from "./api/graph";
import { ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

const UPDATE_EVENT = gql`
  mutation updateEvent($leadId: String!, $name: String!, $value: Int!) {
    updateEvent(leadId: $leadId, input: { name: $name, value: $value }) {
      id
    }
  }
`;

let executed = false;
function UpdateEvent({ leadId }) {
  console.log(leadId);

  const [updateEvent] = useMutation(UPDATE_EVENT);
  if (!executed) {
    updateEvent({ variables: { leadId, name: "welcome", value: -1 } });
    executed = true;
  }

  return <div>{leadId}</div>;
}

export default function Home() {
  let leadId = null;
  const ssrMode = !process.browser;
  if (!ssrMode) {
    leadId = window.localStorage.getItem("leadId");
    if (!leadId) {
      window.location = "/";
    }
  }
  return (
    <ApolloProvider client={client}>
      <div className={styles.container}>
        <Head>
          <title>Logout</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <UpdateEvent leadId={leadId}></UpdateEvent>

        <main className={styles.main}></main>

        <footer className={styles.footer}></footer>
      </div>
    </ApolloProvider>
  );
}
