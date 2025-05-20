;; Process Parameter Contract
;; Monitors manufacturing conditions

(define-data-var last-process-id uint u0)

(define-map process-parameters
  { process-id: uint }
  {
    product-id: uint,
    stage: (string-utf8 50),
    temperature: int,
    pressure: int,
    duration: uint,
    additional-params: (string-utf8 200),
    timestamp: uint,
    recorder: principal
  }
)

(define-public (record-process-parameters
    (product-id uint)
    (stage (string-utf8 50))
    (temperature int)
    (pressure int)
    (duration uint)
    (additional-params (string-utf8 200)))
  (let
    (
      (new-id (+ (var-get last-process-id) u1))
    )
    (var-set last-process-id new-id)
    (map-set process-parameters
      { process-id: new-id }
      {
        product-id: product-id,
        stage: stage,
        temperature: temperature,
        pressure: pressure,
        duration: duration,
        additional-params: additional-params,
        timestamp: block-height,
        recorder: tx-sender
      }
    )
    (ok new-id)
  )
)

(define-read-only (get-process-parameters (process-id uint))
  (map-get? process-parameters { process-id: process-id })
)

(define-read-only (get-last-process-id)
  (var-get last-process-id)
)
