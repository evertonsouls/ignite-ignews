import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { GetStaticProps } from 'next'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import avatarImg from '../../public/images/avatar.svg'
import styles from '../styles/home.module.scss'

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>      
      
      <main className={styles.contentContainer}>

        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>New about the <span>React</span> world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>

        <Image src={avatarImg} alt="Girl coding" />
      </main>
    </>
  )
}


//export const getServerSideProps: GetServerSideProps = async () => {
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID, {
    expand: ['product'],
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),

  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 Hours
  }
}