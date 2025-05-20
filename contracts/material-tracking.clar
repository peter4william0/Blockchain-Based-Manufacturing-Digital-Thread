;; Material Tracking Contract
;; Records components used in production

(define-data-var last-batch-id uint u0)

(define-map material-batches
  { batch-id: uint }
  {
    product-id: uint,
    material-name: (string-utf8 100),
    supplier: (string-utf8 100),
    quantity: uint,
    unit: (string-utf8 20),
    timestamp: uint,
    recorder: principal
  }
)

(define-public (record-material-batch
    (product-id uint)
    (material-name (string-utf8 100))
    (supplier (string-utf8 100))
    (quantity uint)
    (unit (string-utf8 20)))
  (let
    (
      (new-id (+ (var-get last-batch-id) u1))
    )
    (var-set last-batch-id new-id)
    (map-set material-batches
      { batch-id: new-id }
      {
        product-id: product-id,
        material-name: material-name,
        supplier: supplier,
        quantity: quantity,
        unit: unit,
        timestamp: block-height,
        recorder: tx-sender
      }
    )
    (ok new-id)
  )
)

(define-read-only (get-material-batch (batch-id uint))
  (map-get? material-batches { batch-id: batch-id })
)

(define-read-only (get-last-batch-id)
  (var-get last-batch-id)
)
