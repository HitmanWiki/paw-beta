/* eslint-disable max-len */
import Vue from 'vue'

type Question = { question: string, answer: string }

export default Vue.extend<any, any, any, any>({
  data () {
    return {
      questions: [
        {
          question: 'What are the benefits of freelancing for crypto?',
          answer: 'Because cryptocurrency is borderless and global, anyone can apply for a job and get paid, no matter where our Freelancers and Customers are in the world, and regardless of whether they have access to banking services. Crypto job payments are efficient, and blockchain technology enables a truly free and frictionless labour market. Freelancing is also a good way to earn crypto, an attractive new asset class in society today.',
        },
        {
          question: 'What cryptocurrencies can I earn on LaborX?',
          answer: 'LaborX currently supports two major blockchains; Ethereum and BNB Chain. Freelancers and Customers can organise cryptocurrency job payments in ETH, WBTC, TIME, and stablecoins such as USDC, USDT, DAI and AUDT on Ethereum; and BNB, BTCB, TIME, and stablecoins such as BUSD, USDT, USDC and DAI on BNB Chain.',
        },
        {
          question: 'How does a LaborX Premium membership benefit Freelancers?',
          answer: 'Freelancers are charged 10% in platform fees for each Job or Gig they complete. These fees are used to buy TIME tokens on the open market. Freelancers may then receive a rebate of up to half of this amount in TIME tokens, depending on their Premium membership status. This potentially reduces their fees to as little as 5%, as well as giving them a regular payment in a token for which there is constant demand – somewhat akin to a ‘crypto jobs pension’.',
        },
        {
          question: 'How does a LaborX Premium membership benefit Customers?',
          answer: 'Customers receive a bonus in TIME tokens every time they make a payment to a Freelancer. This acts as an incentive for Customers to continue using LaborX for all their hiring needs. The TIME they receive can be held, accruing value over time, or alternatively can be used to pay Freelancers.',
        },
        {
          question: 'Can I apply for crypto jobs without a Premium membership?',
          answer: 'Absolutely! LaborX’s cryptocurrency job market is open to all. However, with even the lowest level of Premium membership, Freelancers will start to earn TIME tokens, allowing them to access higher levels and earn larger rebates – a virtuous cycle.',
        },
        {
          question: 'What is ‘Job Mining’?',
          answer: 'Whenever a task is completed and a job payment is made, LaborX converts its fee into TIME, the native token of the wider Chrono.tech ecosystem. These TIME tokens are distributed between LaborX Freelancers, Customers, and other Chrono.tech stakeholders. This process is called <i>Job Mining</i>.',
        },
        {
          question: 'What is ‘TimeWarp’?',
          answer: 'In addition to being the leading blockchain jobs platform, LaborX is part of a wider suite of services run by Chrono.tech. TimeWarp is Chrono.tech’s TIME token staking program. A portion of the TIME tokens purchased through Job Mining are distributed to TimeWarp stakers. TimeWarp is also a means by which LaborX users can acquire Premium membership, which offers a series of benefits, including increased Job Mining payments for crypto jobs.',
        },
        {
          question: 'What Are Web3 Jobs?',
          answer: 'The growth of the blockchain sector has led to the creation of a wide range of Web3 Jobs. These may be specific to the Web3 space, with roles including smart contract developers and marketing and communications experts with a strong understanding of the technology. In other cases, Web3 jobs will support decentralised projects and communities, but will need no special understanding of blockchain (for example, community management and admin).'
        },
      ]
    }
  },
  metaInfo () {
    return {
      script: [
        {
          vmid: 'FAQPage',
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: this.questions.map((question: Question) => ({
              '@type': 'Question',
              name: question.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: question.answer
              }
            }))
          }
        }
      ]
    }
  },
})
