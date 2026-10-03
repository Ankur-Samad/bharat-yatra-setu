                  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'

                const amount =
                  Number(
                    data.total ??
                    record.amount ??
                    0
                  )

                const guests =
                  Number(
                    data.guests ??
                    record.guests ??
                    1
                  )

                const status =
                  record.status ||
                  data.status ||
                  'PENDING'

                const bookingId =
                  record.bookingId ||
                  data.bookingId ||
                  `BYS-${Date.now()}`

                return (

                  <article
                    className="my-booking-card"
                    key={bookingId}
                  >

                    <img
                      src={image}
                      alt={title}
                    />

                    <div>

                      <span className="card-kicker">
                        {city}
                        {duration
                          ? ` · ${duration}`
                          : ''}
                      </span>

                      <h2>
                        {title}
                      </h2>

                      <p>
                        Hosted by {provider}
                      </p>

                      <div className="booking-card-meta">

                        {data.date && (
                          <span>
                            {data.date}
                          </span>
                        )}

                        {data.time && (
                          <span>
                            {data.time}
                          </span>
                        )}

                        <span>
                          {guests}{' '}
                          guest
                          {guests === 1
                            ? ''
                            : 's'}
                        </span>

                      </div>

                    </div>

                    <div className="my-booking-side">

                      <Status
                        tone={
                          status === 'PENDING'
                            ? 'blue'
                            : status === 'DECLINED'
                              ? 'red'
                              : 'green'
                        }
                      >
                        {status}
                      </Status>

                      <b>
                        {record.paymentStatus ===
                        'SUCCESS'
                          ? 'PAID'
                          : 'PAYMENT PENDING'}
                      </b>

                      <strong>
                        {formatCurrency(amount)}
                      </strong>

                      <small>
                        {bookingId}
                      </small>

                    </div>

                  </article>

                )
              })}

            </div>

          ) : (

            <div className="empty-state">

              <span>◌</span>

              <h3>
                No confirmed bookings yet
              </h3>

              <p>
                Choose a local connection
                and complete the demo
                payment flow to see it
                here.
              </p>

              <Button to="/discover">
                Find an experience
              </Button>

            </div>

          )}

        </main>
      </div>
    </div>
  )
}