window.schemaOptions = {
    "fields": {
      "content": {
        "type": "depositgroup",
        "fields": {
          "name": {
            "order": 1
          },
          "email": {
            "order": 2,
            "type": "email"

          },
          "group": {
            "order": 3,
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "order": 1,
                "type": "select2",
                "select2": true,
                "optionLabels": [
                  "B physics and quarkonia (BPH)",
                  "Beyond-two-generations (B2G)",
                  "Exotica (EXO)",
                  "Forward and Small-x QCD physics (FSQ)",
                  "Higgs physics (HIG)",
                  "Heavy ions physics (HIN)",
                  "Standard Model physics (SMP)",
                  "Supersymmetry (SUS)",
                  "Top physics (TOP)",
                  "Other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "order": 2,
                "type": "textarea" 
              }
            }
          },
          "cadi": {
            "order": 4 
          },
          "opt_title": {
            "order": 5
          },
          "preapproval_date": {
            "order": 6 ,
            "type": "depositgroup-object",
            "fields": {
              "choice": {
                "order": 1,
                "type": "select2",
                "select2": true,
                "optionLabels": [
                  "Scheduled for (please specify)",
                  "Approximate date range (please specify)",
                  "Completely undecided",
                  "Not seeking approval"
                ]
              },
              "date": {
                "order": 2
              }
            }
          },
          "abstract": {
            "order": 7,
            "type": "textarea"
          },
          "cadi_refs": {
            "order": 8,
            "type": "depositgroup-object-array",
            "fields": {
              "item": {
                "fields": {
                  "number": {
                    "order": 1
                  },
                  "comment": {
                    "order": 2,
                    "type": "textarea"
                  }
                }
              }
            }
          }
        }
      },
      "general": {
        "type": "depositgroup",
        "fields": {
          "faq_awareness": {
            "order": 1,
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          },
          "forum_awareness": {
            "order": 2,
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          },
          "forum_subscription": {
            "order": 3,
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          },
          "past_interaction": {
            "order": 4,
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          },
          "meetings_awareness": {
            "order": 5,
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          }
        }
      },
      "multivariate": {
        "type": "depositgroup",
        "fields": {
          "twiki_read": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          },
          "multi_usage": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": ["Yes", "No"]
          },
          "software": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": ["TMVA", "Other (please specify in \"Additional comments\")"]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": "other"
                }
              }
            }
          },
          "type": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Boosted Decision Trees",
                  "Fisher Discriminant",
                  "Product of projected likelihoods",
                  "Artificial Neural Network",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": "other"
                }
              }
            }
          },
          "mva_output_usage": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We cut on the output to improve S/B",
                  "We fit the output distribution to get the signal fraction.",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": "other"
                }
              }
            }
          },
          "input_checks": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We study all 1D distributions.",
                  "We study all 2D distributions."
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": "other"
                }
              }
            }
          },
          "correlation_studies": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We study the correlation matrix between input variables.",
                  "We also study dependencies beyond linear correlation (please specify in \"Additional comments\").",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["nonlinear","other"]
                }
              }
            }
          },
          "input_selection": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Yes, we use the correlation matrix and remove highly correlated variables.",
                  "No, we keep the complete list.",
                  "Other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "null_pdf": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not study that.",
                  "Yes, but this does not apply to my analysis.",
                  "Yes, I make training samples large enough and I checked that this does not occur.",
                  "Yes, and I need to check whether this applies to my analysis.",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "background_mix": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not study that.",
                  "Yes, but this does not apply to my analysis.",
                  "Yes, and I need to check whether this applies to my analysis.",
                  "no (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["no_other"]
                }
              }
            }   
          },
          "overtraining_checks": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not perform any checks.",
                  "We divide the sample into two subsamples: one used exclusively for training, and the other for all subsequent analysis (optimizations, analysis plots, measurements using the discriminant, etc.).",
                  "We do perform checks (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }   
          },
          "robustness_checks": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not perform any checks.",
                  "Yes",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }   
          }
        }
      },
      "data_fitting": {
        "type": "depositgroup",
        "fields": {
          "usage": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Undecided",
              "Yes",
              "No"
            ]
          },
          "functional_form": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Histograms/Templates",
                  "Parametric curves/pdfs",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "fitting_model_choice": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Histograms/Templates from MC",
                  "Histograms/Templates from a data sideband",
                  "Theory curve(s)",
                  "Theory-inspired curve(s)",
                  "Ad-hoc curve(s)",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "test_stats": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "chi-square",
                  "binned likelihood",
                  "unbinned likelihood",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "reason": {
                "type": "textarea"
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "goodness_test": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Undecided",
                  "Yes",
                  "No"
                ]
              },
              "p-value": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Don't know",
                  "<0.1%",
                  "0.1%-1%",
                  "1%-5%",
                  "5%-99%",
                  "99%-99.9%",
                  ">99.9%"
                ],
                "dependencies": {
                  "name": ["undecided", "yes"]
                }
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["undecided", "yes"]
                }
              }
            }
          },
          "toy_exp": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-cb",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not check that.",
                  "No, but we do not use the uncertainty returned by the fit anyway.",
                  "Yes, and the result is that the method is unbiased.",
                  "Yes, and there are some deviations we account for (please specify in \"Additional comments\").",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "cov_matrix": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: We do not use the parameters / uncertainties elsewhere.",
                  "Yes",
                  "No"
                ]
              },
              "comments": {
                "type": "textarea"
              }
            }
          },
          "bcgrnd_shape": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: We do not perform this kind of fitting.",
                  "We perform robustness checks to show that we are insensitive to the choice of the functional form.",
                  "We tried different options and assign a systematic uncertainty from the difference.",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "fit_func_params": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: We do not use such a function for fitting.",
                  "We choose what looks more or less Ok.",
                  "We perform robustness checks to show that we are insensitive to this choice.",
                  "We tried different options and chose the most conservative one.",
                  "We applied a formal decision procedure (such as Fisher F-Test, LR test, please specify in \"Additional comments\")",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "param_bounds": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not check that.",
                  "No",
                  "Yes, but we do not use the uncertainty.",
                  "Yes, and we check that the error calculation is robust anyway.",
                  "Yes, and we trust the errors from the fitter without further checks."
                ]
              },
              "comments": {
                "type": "textarea"
              }
            }
          }
        }
      },
      "confidence": {
        "type": "depositgroup",
        "fields": {
          "usage": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Undecided",
              "Yes",
              "No"
            ]
          },
          "citation": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Completely undecided",
                  "We will only cite a limit.",
                  "We will only cite a two-sided interval.",
                  "We will decide that after looking at data.",
                  "We will cite both.",
                  "Does not apply: we use a unified interval construction approach (Feldman-Cousins)"
                ]
              },
              "comments": {
                "type": "textarea"
              }
            }
          },
          "atlas_cms_agreement": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Does not apply: we do not perform limit computation",
              "Yes",
              "No"
            ]
          },
          "support_awareness": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Does not apply: we do not perform limit computation",
              "Yes",
              "No"
            ]
          },
          "recommendation_awareness": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Does not apply: we do not use Bayesian methods",
              "Yes",
              "No"
            ]
          },
          "approaches": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Frequentist limits",
                  "Frequentist intervals",
                  "Modified frequentist limits (CLs)",
                  "Profile likelihood limits",
                  "Profile likelihood intervals",
                  "Unified Approach (Feldman-Cousins)",
                  "Bayesian limits/intervals, with a flat prior for the parameter of interest",
                  "Bayesian limits/intervals, with a reference prior for the parameter of interest",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "software": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "The \"combine\" tool from the Higgs group",
                  "LandS",
                  "RooStas",
                  "theta",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "test_stats": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: the construction does not make use of a test statistic.",
                  "Likelihood ratio in which nuisance parameters and signal cross section are all fixed to a nominal value (\"LEP-like\").",
                  "Profile likelihood ratio in which nuisance parameters are varied in the maximization and the signal cross section parameter is fixed (\"Tevatron-like\").",
                  "Profile likelihood ratio modified for upper limits in which nuisance parameters are varied in the nominator and denominator. The signal cross section mu is fixed to the currently tested point mu* in the nominator and is varied but constrained to 0 <= mu < mu* in the denominator (sometimes called the \"LHC-like\" test statistic; this is used in the Higgs combination).",
                  "Other (please specify in the extra field)"
                ]
              },
              "details": {
                "type": "textarea",
                "placeholder": "Test Statistics Details (in case of 'Other')",
                "dependencies": {
                  "name": ["other"]
                }
              },
              "comments": {
                "type": "textarea"
              }
            }
          },
          "toy_data": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: the method does not require toys.",
                  "Nuisance parameters are sampled from their priors.",
                  "A fit to data is performed and the fitted nuisance parameter values are used for toy data generation (this is sometimes called \"bootstrapping\").",
                  "Nuisance parameters are not varied.",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "theory_error": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: we do not cite a limit / only cite a limit on the cross section itself.",
                  "We do not account for theory uncertainties.",
                  "We vary the theory prediction by one sigma up/down and cite the most conservative limit.",
                  "We introduce an additional nuisance parameter in the statistical model which modifies the cross section within the theory uncertainty.",
                  "We perform a Bayesian integration over the theory prediction and cite the prior-averaged limit.",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          }
        }
      },
      "discovery": {
        "type": "depositgroup",
        "fields": {
          "twiki_read": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "usage": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Undecided",
              "Yes",
              "No"
            ]
          },
          "test_statistics": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Likelihood ratio in which all nuisance parameters and parameter of interest are fixed to a nominal value",
                  "Profile likelihood ratio in which nuisance parameters and parameter of interest are varied in the maximisation",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea"
              }
            }
          },
          "lookelsewhere_effect": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: we only look for one signal which is completely specified (i.e., mass, width, etc. is known).",
                  "No",
                  "Yes (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea"
              }
            }
          }
        }
      },
      "unfolding": {
        "type": "depositgroup",
        "fields": {
          "note_read": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "usage": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Undecided",
              "Yes",
              "No"
            ]
          },
          "bbb_discouragement_awareness": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "technique": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Bin-by-bin factor",
                  "Matrix inversion",
                  "Generalized Matrix inversion with Tikhonov regularization (=SVD by HC6cker and Kartvelishvili / TUnfold)",
                  "D'Agostini iterative",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "software": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "RooUnfold",
                  "TUnfold (without the RooUnfold interface)",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "validation": {
            "type": "textarea"
          },
          "event_weight_application": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: We do not use event weights for data.",
                  "We first apply the event weight to get the new (weighted) \"observed\" spectrum, which is then unfolded.",
                  "The unfolding is based on the spectrum built from unweighted events; any weight is handled as part of the smearing matrix."
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          }
        }
      },
      "uncertainties": {
        "type": "depositgroup",
        "fields": {
          "twiki_read": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "consideration": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "recommendations_awareness": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "crosschecks": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Undecided",
                  "Yes",
                  "No"
                ]
              },
              "deriving": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Undecided about deriving process",
                  "Yes, we derive from the level of agreement",
                  "No, we do not derive from the level of agreement"
                ],
                "dependencies": {
                  "name": ["no"]
                }
              },
              "failure_procedure": {
                "placeholder": "Procedure in case of cross-check failure",
                "type": "textarea"
              },
              "comments": {
                "type": "textarea"
              }
            }
          },
          "template_morphing": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "No, we do not perform template morphing.",
                  "Yes (please specify how in \"Additional comments\""
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["yes"]
                }
              }
            }
          }
        }
      },
      "other": {
        "type": "depositgroup",
        "fields": {
          "faq_read": {
            "type": "mlt-choice-radio",
            "removeDefaultNone": true,
            "optionLabels": [
              "Yes",
              "No"
            ]
          },
          "blind_analysis": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "We do not perform a blind analysis: we didn't see how to do that practically",
                  "We do not perform a blind analysis",
                  "Yes (please specify how in \"Additional comments\""
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["yes"]
                }
              }
            }
          },
          "combined_measurements": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply: we do not perform a combination",
                  "BLUE",
                  "Combined likelihood function",
                  "other (please specify in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["other"]
                }
              }
            }
          },
          "correlation_treatment": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Does not apply",
                  "Yes, this applies (please specify how in \"Additional comments\")"
                ]
              },
              "comments": {
                "type": "textarea",
                "dependencies": {
                  "name": ["yes"]
                }
              }
              }
            }
          }
      },
      "feedback": {
        "type": "depositgroup",
        "fields": {
          "subject_to_change": {
            "type": "depositgroup-object",
            "fields": {
              "name": {
                "type": "mlt-choice-radio",
                "removeDefaultNone": true,
                "optionLabels": [
                  "Almost nothing is decided, we still expect major changes.",
                  "We already tried some methods but not yet taken a final decision which one to use.",
                  "Decision has been taken on methods, but still need some improvements (such as refining an implementation, etc.).",
                  "Everything is frozen."
                ]
              },
              "comments": {
                "type": "textarea"
              }
            }
          },
          "additional_comments": {
            "type": "textarea"
          },
          "feedback": {
            "type": "textarea"
          }
        }
      }
    },
    "view": "invenio-view"
  };

