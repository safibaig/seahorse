/**
 * Copyright (c) 2015, CodiLime Inc.
 *
 * Owner: Radoslaw Kotowski
 */

package io.deepsense.deeplang.parameters

import spray.json._

import io.deepsense.deeplang.parameters.ParameterType.ParameterType
import io.deepsense.deeplang.parameters.exceptions.ParameterRequiredException

/**
 * Holds parameter value.
 *
 * Parameters are used to fill parameter
 * schemas with their values and validate them.
 */
abstract class Parameter extends DefaultJsonProtocol {
  type HeldValue <: Any

  val parameterType: ParameterType

  val description: String

  /** Flag specifying if parameter is required. */
  val required: Boolean

  /** Value of parameter. */
  def value: Option[HeldValue]

  /**
   * Returns another parameter which has all fields equal to this parameter's fields
   * except for held value.
   */
  private[parameters] def replicate: Parameter

  /**
   * Validates held value.
   * If value is set to None and required, exception is thrown.
   */
  final def validate: Unit = {
    value match {
      case Some(definedValue) => validateDefined(definedValue)
      case None => if (required) {
        throw ParameterRequiredException(parameterType)
      }
    }
  }

  /**
   * Place for additional validation in subclasses.
   * This validation is not performed if value is set to None.
   * This function does nothing by default.
   */
  protected def validateDefined(definedValue: HeldValue): Unit = { }

  /**
   * Provides Json representation describing this parameter.
   */
  def toJson: JsObject = JsObject(basicJsonFields)

  /**
   * Map of fields that should be used in each parameter's Json representation.
   */
  final protected def basicJsonFields: Map[String, JsValue] = {
    Map(
      "type" -> parameterType.toString.toJson,
      "description" -> description.toJson,
      "required" -> required.toJson)
  }
}
