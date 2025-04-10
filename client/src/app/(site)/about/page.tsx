'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 opacity-70"></div>
        <div className="relative container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our FreshMart Story
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              From garden to table, we're redefining what it means to eat fresh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Humble Beginnings
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                FreshMart began in 1985 when Maria and Thomas Chen, immigrants
                with a dream, opened a small corner store in the heart of the
                community. Their vision was simple yet powerful: bring the
                freshest produce directly from local farms to urban tables.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                What started as a tiny shop with just a handful of fruits and
                vegetables quickly became known for its exceptional quality and
                the warm, personal connection the Chens established with both
                local farmers and customers.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/aboutus/imgOne.svg"
                alt="FreshMart origins"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section className="py-16 md:py-24 bg-green-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl md:order-1 order-2">
              <Image
                src="/images/aboutus/imgTwo.svg"
                alt="FreshMart growth"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:order-2 order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Growing With The Community
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                As decades passed, FreshMart grew alongside the community it
                served. The Chens' children, Lisa and Michael, joined the family
                business, bringing modern innovations while preserving the core
                values of freshness and community connection.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                They expanded to multiple locations, but never compromised on
                their commitment to sourcing locally first, establishing
                partnerships with over 200 family farms within a 100-mile radius
                of each store.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values Today
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              While we've grown, our core beliefs remain unchanged.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Freshness Guarantee
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We believe you deserve produce that was harvested at its peak.
                That's why we work directly with farmers to ensure the shortest
                path from farm to table.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Community First
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We're proud to be more than just a store – we're a community hub
                where relationships are built and sustained through our shared
                love of good food.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Sustainability
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our commitment to the planet drives everything from our
                packaging choices to our zero-waste initiatives and support for
                regenerative farming practices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Today Section */}
      <section className="py-16 md:py-24 bg-green-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                FreshMart Today
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Today, FreshMart has evolved into an innovative blend of
                tradition and technology. Our online marketplace brings the
                farm-fresh experience to your doorstep, while our stores
                continue to be spaces where food lovers gather to discover new
                flavors and reconnect with food's source.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The Chen family's third generation now works alongside a diverse
                team of passionate food experts, all united by the belief that
                everyone deserves access to fresh, nutritious food that respects
                both people and planet.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/aboutus/imgThree.svg"
                alt="FreshMart today"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Fresh Food Journey
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Every purchase you make is a vote for a healthier food system and
              a more connected community.
            </p>
            <a
              href="/grocery"
              className="inline-block bg-white text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
              Shop Fresh Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
