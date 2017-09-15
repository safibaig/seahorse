/**
 * Copyright (c) 2015, CodiLime Inc.
 */

package io.deepsense.deeplang.doperations

import io.deepsense.deeplang._
import io.deepsense.deeplang.doperables.{Regressor, Scorable, Trainable}
import io.deepsense.deeplang.parameters.{MultipleColumnSelection, NameColumnSelection, NameSingleColumnSelection}

case class TrainRegressor() extends Trainer[Regressor with Trainable, Regressor with Scorable] {
  override val id: DOperation.Id = "c526714c-e7fb-11e4-b02c-1681e6b88ec1"
  override val name = "Train Regressor"
}

object TrainRegressor {
  def apply(featureColumns: Set[String], targetColumn: String): TrainRegressor = {
    val regressor = TrainRegressor()

    val trainableParametersStub = Trainable.Parameters(
      Some(MultipleColumnSelection(Vector(NameColumnSelection(featureColumns)))),
      Some(NameSingleColumnSelection(targetColumn))
    )

    regressor.parameters.
      getSingleColumnSelectorParameter("target column").value = trainableParametersStub.targetColumn

    regressor.parameters.
      getColumnSelectorParameter("feature columns").value = trainableParametersStub.featureColumns

    regressor
  }
}
