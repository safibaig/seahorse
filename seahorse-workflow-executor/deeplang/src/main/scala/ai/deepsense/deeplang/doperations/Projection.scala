/**
 * Copyright 2016 deepsense.ai (CodiLime, Inc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.deepsense.deeplang.doperations

import scala.reflect.runtime.universe.TypeTag

import ai.deepsense.commons.utils.Version
import ai.deepsense.deeplang.DOperation.Id
import ai.deepsense.deeplang.documentation.OperationDocumentation
import ai.deepsense.deeplang.doperables.Projector

class Projection extends TransformerAsOperation[Projector] with OperationDocumentation {

  override val id: Id = "9c3225d8-d430-48c0-a46e-fa83909ad054"
  override val name: String = "Projection"
  override val description: String =
    "Projects subset of columns in specified order and with (optional) new column names"

  override lazy val tTagTO_1: TypeTag[Projector] = typeTag

  override val since: Version = Version(1, 2, 0)
}
