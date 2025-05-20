;; Lifecycle Tracking Contract
;; Follows product through use and disposal

(define-data-var last-lifecycle-event-id uint u0)

(define-map lifecycle-events
  { event-id: uint }
  {
    product-id: uint,
    event-type: (string-utf8 50),
    location: (string-utf8 100),
    description: (string-utf8 200),
    timestamp: uint,
    recorder: principal
  }
)

(define-public (record-lifecycle-event
    (product-id uint)
    (event-type (string-utf8 50))
    (location (string-utf8 100))
    (description (string-utf8 200)))
  (let
    (
      (new-id (+ (var-get last-lifecycle-event-id) u1))
    )
    (var-set last-lifecycle-event-id new-id)
    (map-set lifecycle-events
      { event-id: new-id }
      {
        product-id: product-id,
        event-type: event-type,
        location: location,
        description: description,
        timestamp: block-height,
        recorder: tx-sender
      }
    )
    (ok new-id)
  )
)

(define-read-only (get-lifecycle-event (event-id uint))
  (map-get? lifecycle-events { event-id: event-id })
)

(define-read-only (get-last-lifecycle-event-id)
  (var-get last-lifecycle-event-id)
)
